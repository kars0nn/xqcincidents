// TODO ADD INCIDENT COUNTER WITH LASTEST INCIDENT BELOW AND A LINK TO AN ABOUT PAGE AND ALL INCIDENTS

import { Link, Form, Outlet, useLoaderData, NavLink } from '@remix-run/react'
import { GoCommentDiscussion } from 'react-icons/go'
import { authenticator, isUserLoggedIn, twitchStrategy } from '~/services/auth.server';
import { getAllIncidentsPending } from '~/services/incident.server';
import Timestamp from 'react-timestamp'
import { ClientOnly } from 'remix-utils';
import { Username } from '~/components/Username';
import { redirect } from '@remix-run/node';

export const loader = async ({ request }) => {
    let user = await isUserLoggedIn(request)
    if(user.role !== 'MOD' && user.role !== 'ADMIN') return redirect('/');
    if (user.error) return user.error;
    let incidents = await getAllIncidentsPending();
    return { user, incidents };
};

export default function Poopshit() {
    let { user, incidents } = useLoaderData()

    return (
        <>
            <div className="lg:pl-28 lg:pr-28 md:pl-4 md:pr-4 md:m-0 mx-4">
                <div className="md:flex md:-mx-4">
                    <div className="w-full h-auto md:sticky md:top-12 md:mx-6 md:w-3/6 filter backdrop-blur-sm">
                        <div className='grid grid-cols-1 gap-2 rounded-lg md:px-16 md:py-5'>
                            {
                                incidents.length
                                    ?
                                    <>
                                        {incidents.map((i) =>
                                            <div key={i.id} className="bg-black/40">
                                                <NavLink to={`${i.id}`} className={({ isActive }) => isActive ? "p-3 bg-black block shadow-lg transition-all duration-200 ease-in-out" : "p-3 hover:bg-black/90 block transition-all duration-200 ease-in-out"}>
                                                    <div className='text-red-400 pb-3 inline text-xs'>[PENDING] </div>
                                                    <h className="text-lg font-extrabold">{i.name} </h>
                                                    <br />
                                                    <small>
                                                        submitted by <Username user={i.submitter} />
                                                    </small>
                                                </NavLink>
                                            </div>
                                        )}
                                    </>
                                    :
                                    <>
                                        <div className="w-full h-auto md:sticky md:top-12 md:mx-6 md:w-3/6 filter backdrop-blur-sm">
                                            <div className='text-center font-extrabold text-2xl'>
                                                All caught up!
                                            </div>
                                            <br />
                                            <br />
                                            <img src='https://cdn.7tv.app/emote/617b905ab0bfad942896b879/4x.webp' />
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                    <div className="w-full md:mx-4 md:w-6/7">
                        <br className='md:hidden' />
                        <Outlet />
                    </div>
                </div>
                <br />
            </div>
        </>
    );
}
