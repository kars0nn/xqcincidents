import { GoCommentDiscussion } from 'react-icons/go'
import { Link, useLoaderData } from '@remix-run/react'
import { authenticator, isUserLoggedIn, isUserLoggedInSafe, twitchStrategy } from '~/services/auth.server';
import { getAllIncidents } from '~/services/incident.server';
import { Username } from '~/components/Username';
import Timestamp from 'react-timestamp'
import { ClientOnly } from 'remix-utils';

export const loader = async ({ request }) => {
    let user = await isUserLoggedInSafe(request)
    let incidents = await getAllIncidents()
    return { user, incidents };
};

export default function Index() {
    let { user, incidents } = useLoaderData();

    return (
        <div className='grid place-items-center'>
            {
                user
                    ?
                    <>
                        <Link className='mb-3 px-2 py-0.5 bg-black/20 rounded-md hover:bg-black/30' to="submit">
                            Submit an Incident
                        </Link>
                    </>
                    :
                    <>
                    </>
            }
            {
                incidents.length
                    ?
                    <>
                        {incidents.map((i) =>
                            <div key={i.id} className='p-4 md:p-6 w-full md:w-3/4 mt-2 lg:w-3/5 hover:bg-purple-600/20 bg-purple-600/5 md:rounded-lg border-purple-600 border-r-2 border-l-2 transition-all duration-150 ease-in-out hover:shadow-lg mb-5'>
                                <Link to={`${i.id}`} key={i.id} >
                                    <div key={i.title}>
                                        <div className='font-extrabold text-xl text-neutral-400'>
                                            <ClientOnly>
                                                {() => <Timestamp relative date={i?.date} />}
                                            </ClientOnly>
                                            <img src={i.thumbnail_url} className="hidden lg:inline-block lg:w-40 lg:float-right lg:rounded-xl" />
                                        </div>
                                        <h2 className='text-2xl font-extrabold'>
                                            {i.name}
                                        </h2>
                                        <br className='hidden lg:block' />
                                        <img src={i.thumbnail_url} className="w-full md:w-1/2 lg:w-1/3 my-3 rounded-lg lg:hidden" />
                                        <br className='hidden lg:block' />
                                        <div className='inline'>
                                            <span className="font-bold font-mono ml-1">{i.awares.length}</span> <img title='awares' src="https://cdn.7tv.app/emote/613265d8248add8fdae01ad0/1x.webp" className='inline w-[20px] ml-0.5 mr-2' />
                                            | <span className='text-white'><span className="font-bold font-mono">{i.comments.length}</span> </span><GoCommentDiscussion className='inline text-neutral-400 text-lg ml-0.5 mr-2' title='comments' />
                                        </div>
                                        <br className='md:hidden' />
                                        <small className='md:float-right translate-y-2'>Clipped by {i.clipper} - Submitted by <Username small user={i.submitter} /> </small>
                                        <br />
                                    </div>
                                </Link>
                            </div>
                        )}
                    </>
                    :
                    <>
                        <div className='rounded-xl p-10 bg-black/20 text-2xl font-extrabold text-center'>
                            There hasn't been an approved incident yet!
                            <br />
                            <br />
                            <img src='https://cdn.7tv.app/emote/63712595ca53769f904bb33c/4x.webp' alt="pallaslol's ghost emote on 7tv" title="pallaslol's Ghost emote on 7tv" className='m-auto' />
                        </div>
                    </>
            }
        </div>
    )
}

export function ErrorBoundary({ error }) {
    console.error(error);
    return (
        <>
            <div className='grid place-items-center bg-red-700/50 border-red-600 border-r-4 border-l-4 p-10 rounded-2xl font-extrabold'>
                <h1 className="text-4xl">
                    well shit
                </h1>
                <br />
                <div>
                    There was an error loading stuff... try again later.
                </div>
                <br />
                <img src="https://cdn.7tv.app/emote/60afccdeebfcf7562e289afa/4x.webp" />
                <br />
                <Link className="bg-black/40 px-4 py-1 rounded-xl hover:underline" to="/">
                    Go home.
                </Link>
            </div>
        </>
    );
}