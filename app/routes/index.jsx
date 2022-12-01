// TODO ADD INCIDENT COUNTER WITH LASTEST INCIDENT BELOW AND A LINK TO AN ABOUT PAGE AND ALL INCIDENTS

import { Link, Form, useLoaderData } from '@remix-run/react'
import { GoCommentDiscussion } from 'react-icons/go'
import { authenticator, isUserLoggedIn, isUserLoggedInSafe, twitchStrategy } from '~/services/auth.server';
import { getAllIncidents, getLatestIncident } from '~/services/incident.server';
import { Username } from '~/components/Username';
import Timestamp from 'react-timestamp'
import { ClientOnly } from 'remix-utils';
import Since from 'react-since'

export const loader = async ({ request }) => {
  let user = await isUserLoggedInSafe(request)
  let incident = await getLatestIncident()
  return { user, incident };
};

export default function Index() {
  let { user, incident } = useLoaderData();
  let i = incident

  return (
    <>
      <div className="lg:pl-28 lg:pr-28 md:pl-4 md:pr-4 md:m-0 mx-4">
        <div className="md:flex md:-mx-4">
          <div className="w-full h-auto md:sticky text-center md:top-12 md:mx-6 md:w-4/6 place-items-center filter backdrop-blur-sm bg-black/50 p-5 rounded-2xl">
            <span className='text-md font-extrabold'>Time since last incident:</span>
            <br />
            <h1 className='text-5xl font-mono font-bold inline'>
              <ClientOnly>
                {() => i == null ? 'No incidents!' : <Timestamp date={i?.date} relative />}
              </ClientOnly>
            </h1>
            <div className='text-center'>
              <br />
              {i
                ?
                <img src="https://cdn.7tv.app/emote/6145e8b10969108b671957ec/3x.webp" className='inline' alt="MegaKill3's Aware emote on 7tv" title="MegaKill3's Aware emote on 7tv" />
                :
                <img src="https://cdn.7tv.app/emote/62fc47223b0b86169e3809f0/3x.webp" className='inline' alt="MegaKill3's Aware emote on 7tv" title="MegaKill3's Aware emote on 7tv" />

              }
            </div>
          </div>
          <div className="w-full md:mx-4 md:w-6/7">
            <br className='md:hidden' />
            <div className='mb-4 font-extrabold text-xl'>
              Last Recorded Incident:
            </div>
            {
              i
                ?
                <div key={i.id} className='p-4 md:p-6 hover:bg-purple-600/20 bg-purple-600/5 md:rounded-lg border-purple-600 border-r-2 border-l-2 transition-all duration-150 ease-in-out hover:shadow-lg mb-5'>
                  <Link to={`/i/${i.id}`} key={i.id} >
                    <div key={i.title}>
                      <div className='font-extrabold text-xl text-neutral-400'>
                        <ClientOnly>
                          {() => <Since date={i.date} live={true} />}
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
                        <span className='text-white'><span className="font-bold font-mono">{i.comments.length}</span> </span><GoCommentDiscussion className='inline text-neutral-400 text-lg ml-0.5 mr-2' title='comments' />
                        | <span className="font-bold font-mono ml-1">{i.awares.length}</span> <img title='awares' src="https://cdn.7tv.app/emote/613265d8248add8fdae01ad0/1x.webp" className='inline w-[20px] ml-0.5' />
                      </div>
                      <br className='md:hidden' />
                      <small className='md:float-right translate-y-2'>Clipped by {i.clipper} - Submitted by <Username small user={i.submitter} /> </small>
                      <br />
                    </div>
                  </Link>
                </div>
                :
                <>
                  Nothing yet :)
                </>
            }
          </div>
        </div>
        <br />
        <div className='text-center'>
          {
            user
              ?
              <>
                <br className='hidden md:block' />
                <Link className='mb-3 px-4 py-2 bg-blue-700 text-yellow-300 font-bold rounded-md transition-all duration-100 ease-in-out hover:bg-blue-600' to="/i/submit">
                  Submit an Incident
                </Link>
                <br />
                <br />
                or
                <br />
              </>
              :
              <>
              </>
          }
          <br />
          <Link className='hover:underline font-extrabold text-xl' to="/i">view all incidents</Link>
        </div>
        <br />
      </div>
      {/* <div className='grid place-items-center'>
        <div className='p-10 w-full md:w-1/2 lg:w-3/5 filter backdrop-blur-lg bg-white/5 md:rounded-lg bg-opacity-80 text-center border-yellow-400 border-r-4 border-l-4'>
          <span className='text-md font-extrabold'>Time since last incident:</span>
          <br />
          <h1 className='text-6xl font-mono font-bold'>
            22:01:21
          </h1>
        </div>
        <br />
        <br />
        <img src="https://cdn.7tv.app/emote/6145e8b10969108b671957ec/4x.webp" />
        <br />
        <br />

      </div> */}
    </>
  );
}
