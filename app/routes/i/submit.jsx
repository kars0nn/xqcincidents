import { authenticator, isUserLoggedIn, twitchStrategy } from '~/services/auth.server';
import { useLoaderData, Form, useActionData, useTransition } from '@remix-run/react'
import { redirect } from '@remix-run/node';
import { findUserByTwitchId } from '~/services/user.server';
import { sessionStorage } from '~/services/session.server'
import { GoCommentDiscussion } from 'react-icons/go'
import { TwitchClip } from 'react-twitch-embed';
import { Link } from '@remix-run/react'
import { ClientOnly } from 'remix-utils';
import { useState } from 'react';
import invariant from "tiny-invariant";
import isString from 'is-string'
import { submitIncident } from '~/services/incident.server';

export const loader = async ({ request }) => {
    let user = await isUserLoggedIn(request)
    if (user.error) return user.error;
    return user;
};

export async function action({ request }) {
    let errors = {}
    let user = await isUserLoggedIn(request)
    if (user.error) return user.error;
    let formData = await request.formData();
    let { _action, ...values } = Object.fromEntries(formData);

    if (values?.title?.trim() === "" || values?.title === null || !isString(values?.title)) {
        errors.blanktext = true
    }
    if (values?.description?.trim() === "" || values?.description === null || !isString(values?.description)) {
        errors.blanktext = true
    }
    if (values?.clip?.trim() === "" || values?.clip === null || !isString(values?.clip)) {
        errors.blanktext = true
    }

    let incident = await submitIncident(values, user, user.temp_token)

    if (incident?.id) {
        return redirect('/i');
    } else {
        errors.errorMaking = true
    }

    if (Object.keys(errors).length) {
        return errors;
    }
}


export default function Submit() {
    const user = useLoaderData();
    const data = useActionData();
    const transition = useTransition();

    const [title, setTitle] = useState('');
    const [clip, setClip] = useState('FilthyConsiderateAirGuitarKappaPride');
    const [description, setDescription] = useState('');

    return (
        <>
            {
                data?.success
                    ?
                    <>
                        <br />
                        <br />
                        <br />
                        <div className='m-auto text-3xl font-extrabold text-center'>
                            Success!
                            <br />
                            <br />
                            <span className='text-lg hover:underline text-red-500'>
                                <Link to="/">
                                    Go Home
                                </Link>
                            </span>
                        </div>
                    </>
                    :
                    <>
                        <div className="lg:pl-28 lg:pr-28 md:pl-4 md:pr-4 md:m-0 mx-4">
                            <div className="md:flex md:-mx-4">
                                <div className="w-full h-[25%] md:sticky md:top-12 md:mx-6 md:w-[60%] place-items-center filter backdrop-blur-sm bg-black/50 p-5 rounded-2xl">
                                    <div className='mb-5 px-0.5 py-0.5 hover:translate-x-3 transition-all duration-150 ease-in-out'>
                                        <Link to="/i" title='incidents page'>
                                            Go Back
                                        </Link>
                                    </div>
                                    <div className='text-3xl font-bold'>
                                        Create Incident:
                                    </div>
                                    <br />
                                    <Form method='post'>
                                        <div>
                                            <label htmlFor='title' className='mb-2 block font-mono'>Title</label>
                                            <input placeholder='Ex: The Fortnite Incident' onChange={(e) => setTitle(e.target.value)} className='filter backdrop-blur-md bg-black/80 border border-1 border-white w-full p-2 rounded-md' type="text" name="title" id="title" maxLength={70} />
                                            <small className='text-neutral-500'>Try to make this breif</small>
                                        </div>
                                        <div className='mt-3'>
                                            <label htmlFor='description' className='mb-2 block font-mono'>Description</label>
                                            <textarea placeholder='Ex: xQc makes a sus rage-filled comment after getting sniped on the popular hit game Fortnite.' onChange={(e) => setDescription(e.target.value)} className='filter backdrop-blur-md bg-black/80 border border-1 border-white w-full p-2 rounded-md' name="description" id="description" rows={3} />
                                        </div>
                                        <div className='mt-3'>
                                            <label htmlFor='clip' className='mb-2 block font-mono'>Clip url slug</label>
                                            <input placeholder='Ex: FilthyConsiderateAirGuitarKappaPride' onChange={(e) => setClip(e.target.value)} className='filter backdrop-blur-md bg-black/80 border border-1 border-white w-full p-2 rounded-md' type="clip" name="clip" id="clip" />
                                            <small className='text-neutral-500'>https://www.twitch.tv/xqc/clip/<span className="text-red-500 font-bold break-words">FilthyConsiderateAirGuitarKappaPride</span></small>
                                        </div>
                                        <br />
                                        {
                                            data?.blanktext
                                                ?
                                                <>
                                                    <small className='text-red-600'>One or more fields are not valid. Please fix and try again.</small>
                                                    <br />
                                                    <br />
                                                </>
                                                :
                                                <>
                                                </>
                                        }
                                        {
                                            data?.errorMaking
                                                ?
                                                <>
                                                    <small className='text-red-600'>There was an error submitting, please try again later.</small>
                                                    <br />
                                                    <br />
                                                </>
                                                :
                                                <>
                                                </>
                                        }
                                        <button title='submit the goddam form' disabled={transition.state === 'submitting'} className='p-2 rounded-lg bg-black border-1 border hover:bg-neutral-800 transition-all duration-200 ease-in-out'>
                                            {transition.state === 'submitting' ? 'Submitting...' : 'Submit for review'} <img className='inline w-5' src={transition.state === 'submitting' ? 'https://cdn.7tv.app/emote/617b905ab0bfad942896b879/1x.webp' : 'https://cdn.7tv.app/emote/60ba1f0bde5cde7ee0f8def7/1x.webp'} />
                                        </button>
                                    </Form>
                                </div>
                                <div className="w-full md:mx-4 md:w-[40%]">
                                    <br className='md:hidden' />
                                    <h1 className='font-extrabold text-3xl'>Preview:</h1>
                                    <br />
                                    <div className='p-6 filter backdrop-blur-lg bg-white/5 rounded-lg bg-opacity-80'>
                                        <h1 className='font-extrabold text-3xl'>
                                            {title}
                                        </h1>
                                        <br />
                                        <div className='m max-w-full md:max-w-1/2 lg:max-w-3/5'>
                                            <ClientOnly>
                                                {(() =>
                                                    <TwitchClip clip={clip} className='rounded-lg w-full h-72 lg:h-96 lg:w-full' />
                                                )}
                                            </ClientOnly>
                                        </div>
                                        <br />
                                        <p className='p-3 rounded-md bg-black/20 text-neutral-200'>{description}</p>
                                        <br />
                                        <span className="font-bold font-mono text-lg"><img title='awares' src="https://cdn.7tv.app/emote/613265d8248add8fdae01ad0/1x.webp" className='inline ml-0.5' /> 0</span>

                                    </div>
                                </div>
                            </div>
                            <br />
                        </div>
                    </>
            }
        </>

    );
}
