import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useTransition,
  Form,
  useLoaderData
} from "@remix-run/react";
import { useEffect } from "react";
import styles from "./styles/app.css"
import NProgress from "nprogress";
import nProgressStyles from "nprogress/nprogress.css";
import { Menu } from '@headlessui/react'
import { DropdownMenu } from "./components/menu";
import { findUserById } from '~/services/user.server';
import { authenticator, twitchStrategy } from '~/services/auth.server';
import { Footer } from "./components/Footer";
import { isUserLoggedInSafe } from "~/services/auth.server";
import { BsTwitch } from 'react-icons/bs'

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: nProgressStyles },
  ]
}

export const loader = async ({ request }) => {
  let user = await isUserLoggedInSafe(request)
  return { user };
};


// export const loader = async ({ request }) => {
//   let checkUser = await authenticator.isAuthenticated(request);
//   if(!checkUser) return {isLoggedIn:false};
//   const user = await findUserById(checkUser?.user_id)
//   if (user) {
//     return { isLoggedIn: true }
//   } else {
//     return { isLoggedIn: false }
//   }
// };

export const meta = () => ({
  charset: "utf-8",
  title: `xQc incidents`,
  'og:title': `xQc incidents`,
  description: `a collection of incidents that occur on xQc's stream`,
  'og:description': `a collection of incidents that occur on xQc's stream`,
  author: `dkarsonn`,
  'og:image': `/favicon.ico`,
  'og:type': `website`,
  'og:image:alt': 'Aware',
  viewport: "width=device-width,initial-scale=1",
  "referrer": "strict-origin-when-cross-origin"
})

export default function App() {
  let data = useLoaderData()
  let transition = useTransition();
  useEffect(() => {
    if (transition.state === "idle") NProgress.done();
    else if (!transition.submission) NProgress.start();
    NProgress.configure({ showSpinner: false });
  }, [transition.state]);
  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <Meta />
        <Links />
      </head>
      <body className="bg-neutral-900 text-white">
        <noscript>
          <div className="font-bold text-xl bg-yellow-400 text-black p-2">
            turn on javascript for the best experience
          </div>
        </noscript>
        <Navigation>
          <Outlet />
        </Navigation>
        <Footer user={data.user} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function Navigation({ children }) {
  let data = useLoaderData()
  // let check = data.isLoggedIn
  return (
    <>
      <div className="p-2.5 bg-black/20" >
        {
          data?.user?.is_banned === true
            ?
            <>
              <span className="w-12 inline mr-5 ">YOU ARE BANNED.</span>
            </>
            :
            <Link to="/">
              <img src="https://cdn.7tv.app/emote/6249bf0a835f6c1e0ad979bb/4x.webp" className="w-12 inline mr-5" alt="fabulous_pshyco's xqcDespair emote on 7tv" title="fabulous_pshyco's xqcDespair emote on 7tv" />
              <span className="font-bold hover:underline" title="xQc incidents">xQc incidents</span>
            </Link>
        }
        {
          data?.user
            ?
            <>
              <div className="float-right">
                <Form action='/logout' method="post">
                  <button className='bg-purple-600 p-2 rounded-lg text-white border-b-purple-900 border-b-2 '><BsTwitch className="inline" /> Logout</button>
                </Form>
              </div>
            </>
            :
            <>
              <div className="float-right">
                <Form action='/auth/twitch' method="post">
                  <button className='bg-purple-600 font-bold p-2 rounded-lg text-white border-b-purple-900 border-b-2 '><BsTwitch className="inline" /> Login with twitch</button>
                </Form>
              </div>
            </>
        }
      </div>
      <br />
      {children}
    </>
  )
}
