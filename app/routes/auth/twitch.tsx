import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator, twitchStrategy } from '~/services/auth.server';

export const loader: LoaderFunction = () => redirect('/auth/twitch/callback');

export const action: ActionFunction = async ({ request }) => {
    return await authenticator.authenticate('twitch', request);
};