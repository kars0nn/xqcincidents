import { authenticator, twitchStrategy } from '~/services/auth.server';
import { useLoaderData } from '@remix-run/react'
import { redirect } from '@remix-run/node';
import { findUserByTwitchId } from '~/services/user.server';
import { sessionStorage } from '~/services/session.server'

export const loader = async ({ request }) => {
    try {
        let checkUser = await authenticator.isAuthenticated(request, {failureRedirect: '/auth/twitch'});
        let u = await twitchStrategy.validate({ token: checkUser.accessToken });
        const user = await findUserByTwitchId(u.user_id)
        return user
    } catch (error) {
        return authenticator.logout(request, { redirectTo: "/auth/twitch" });
    }
};


export default function Protected() {
    const user = useLoaderData();

    return (
        <h1 className="text-3xl font-bold underline">
            welcome {user.display_name} :)
        </h1>
    );
}
