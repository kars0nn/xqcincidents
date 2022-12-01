import { LoaderFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';

export const loader: LoaderFunction = ({ request }) => {
    return authenticator.authenticate('twitch', request, {
        successRedirect: '/',
        failureRedirect: '/ohno',
    })
};