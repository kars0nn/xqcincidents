import { json, redirect } from '@remix-run/node';

import { destroySession, getSession } from '~/services/session.server';

export const action = async ({ request }) => {
    return redirect('/', {
        headers: {
            'Set-Cookie': await destroySession(
                await getSession(request.headers.get('cookie')),
            ),
        },
    });
};

export const loader = () => {
    throw json({}, { status: 404 });
};