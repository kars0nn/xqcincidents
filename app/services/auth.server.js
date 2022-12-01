import { TwitchStrategy } from "remix-auth-twitch";
import { Authenticator, AuthorizationError } from 'remix-auth';
import { sessionStorage } from './session.server';
import { db } from './prisma.server'
import { encryptData } from "./encrypt.server";
import { findUserById, getUserBadge } from "./user.server";

const twitchClientId = process.env.TWITCH_API_CLIENT;
const twitchClientSecret = process.env.TWITCH_API_SECRET;

const whitelist = [
  "dkarsonn",
  "vmyk",
  "vmykbot",
  "jasonwecksell"
]

export const twitchStrategy = new TwitchStrategy(
  {
    clientId: twitchClientId,
    clientSecret: twitchClientSecret,
    callbackURL: process.env.REDIRECT_URL,
    sessionStorage,
    includeEmail: true,
  },
  async ({ profile, token }) => {
    if (whitelist.includes(profile.display_name)) {
      let email = profile.email
      let encryptEmail = await encryptData(email)
      let apiToken = await encryptData(token.access_token)
      try {
        let badge = await getUserBadge(profile.id)

        let user = await db.user.upsert({
          where: {
            twitch_id: profile.id
          },
          update: {
            profile_image: profile.profile_image_url,
            stvbadge_tooltip: badge?.tooltip ?? null,
            stvbadge_url: badge?.url ?? null,
            temp_token: apiToken
          },
          create: {
            twitch_id: profile.id,
            display_name: profile.display_name,
            profile_image: profile.profile_image_url,
            stvbadge_tooltip: badge?.tooltip ?? null,
            stvbadge_url: badge?.url ?? null,
            email: encryptEmail,
            broadcaster_type: profile.broadcaster_type === "" ? "normal" : profile.broadcaster_type,
            description: profile.description ? profile.description : "twitch.",
            temp_token: apiToken
          }
        })

        return {
          user_id: user.id,
          accessToken: token.access_token,
        };
      } catch (error) {
        console.log(error)
        return null
      }
    } else {
      return 
    }
  }
);

export const authenticator = new Authenticator(sessionStorage);

authenticator.use(twitchStrategy, "twitch");

export async function isUserLoggedIn(request) {
  let checkUser = await authenticator.isAuthenticated(request);
  if (!checkUser) return authenticator.logout(request, { redirectTo: "/" });
  const user = await findUserById(checkUser?.user_id)
  if (!user) return authenticator.logout(request, { redirectTo: "/" });

  return user
}

export async function isUserLoggedInSafe(request) {
  let checkUser = await authenticator.isAuthenticated(request);
  const user = await findUserById(checkUser?.user_id ?? 'ballsack');

  return user
}