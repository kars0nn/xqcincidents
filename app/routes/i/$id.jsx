import { TwitchClip } from 'react-twitch-embed';
import { Link, useLoaderData, Form, useActionData, NavLink, useTransition, useFetcher } from '@remix-run/react'
import { ClientOnly } from 'remix-utils';
import { authenticator, isUserLoggedIn, isUserLoggedInSafe, twitchStrategy } from '~/services/auth.server';
import { acceptIncident, addAwareToIncident, addCommentToIncident, getClipInfo, getIncident, hasUserLikedPost, rejectIncident, removeAwareFromIncident, removeCommentFromIncident } from '~/services/incident.server';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import Timestamp from 'react-timestamp'
import { Username } from '~/components/Username';
import SevenTV from '7tv'
import { CommentI } from '~/components/CommentI'
import { RiChatDeleteLine } from 'react-icons/ri'

export const loader = async ({ request, params }) => {
    const id = params.id
    let user = await isUserLoggedInSafe(request)
    let incident = await getIncident(id);
    let hasLiked = await hasUserLikedPost(user?.id, incident?.id)
    const api = SevenTV()
    const emotes = await api.fetchUserEmotes('xqc')
    if (user) {
        incident?.comments?.forEach((c) => {
            if (c.creator_id === user?.id) {
                c.can_user_modify = true
                c.modify_type = 'author'
            } else if (user?.role === 'ADMIN' || user?.role === 'MOD') {
                c.can_user_modify = true
                c.modify_type = 'moderator'
            }
        })
    }
    return { incident, user, user_liked_post: hasLiked, emotes }
};

export async function action({ request }) {
    let errors = {}
    let user = await isUserLoggedIn(request) //use this user to define what user liked/commented
    if (user.error) return user.error;
    let formData = await request.formData();
    let { _action, ...values } = Object.fromEntries(formData);

    if (_action === 'like') {
        try {
            await addAwareToIncident(user?.id, values?.id, user.temp_token)

            return { message: 'Reacted to incident!' }
        } catch (e) {
            console.log(e)
            return { error: true }
        }
    } else if (_action === 'unlike') {
        try {
            await removeAwareFromIncident(user?.id, values?.id, user.temp_token)

            return { message: 'Taking away reaction from incident...' }
        } catch (e) {
            console.log(e)
            return { error: true }
        }
    } else if (_action === 'comment') {
        if (values?.content?.trim() === "" || values?.content === null) {
            errors.blanktext = true
        }
        // if (values?.mood?.trim() === "" || values?.mood === null || !isString(values?.mood)) {
        //     errors.blanktext = true
        // }
        if (values?.content?.length > 420) {
            errors.toolong = true
        }

        if (Object.keys(errors).length) {
            return errors;
        }

        await addCommentToIncident(user?.id, values?.id, values.content, user.temp_token)

        return { message: "Adding comment..." }
    } else if (_action === 'delete_comment') {
        try {
            await removeCommentFromIncident(values?.comment_id, user.id, values?.incident_id, user.temp_token)

            return { message: "Deleting comment..." }
        } catch (e) {
            console.log(e)
            return { error: true, id: values?.comment_id ?? "none" }
        }
    }
}

export function meta({ data }) {
    let incident = data?.incident
    return {
        title: `${incident.name ?? 'not found'}`,
        'og:title': `${incident.name ?? 'not found'}`,
        description: `${incident.description ?? 'not found'}`,
        'og:description': `${incident.description ?? 'not found'}`,
        author: `twitch.tv/xQc`,
        'og:url': `https://xqc.fail/i/${incident.id}`,
        'og:image': `${incident.thumbnail_url ?? 'not found'}`,
        'theme-color': '#000000'
    };
}

export default function Incident() {
    let { incident, user, user_liked_post, emotes, error } = useLoaderData()
    let errors = useActionData()
    let transition = useTransition()
    let fetcher = useFetcher()
    let isLiking = transition.submission && transition.submission?.formData.get("_action") === "like";
    let isUnliking = transition.submission && transition.submission?.formData.get("_action") === "unlike";


    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            {incident !== null
                ?
                <>
                    <div className='grid place-items-center'>
                        <div className='p-6 w-full md:w-1/2 lg:w-3/5 filter backdrop-blur-lg bg-black/20 md:rounded-lg bg-opacity-80'>
                            <div className='bg-black/20 p-3 rounded-lg'>
                                <div className='mb-1 hover:translate-x-3 transition-all duration-150 ease-in-out'>
                                    <NavLink to="/i" className="hover:underline mb-1 px-0.5 py-0.5 " title='incidents page'>
                                        Go Back
                                    </NavLink>
                                </div>
                                <h1 className='font-extrabold text-3xl'>
                                    {incident?.name}
                                </h1>
                                <div className='font-bold text-xl text-neutral-400'>
                                    {/* <Timestamp date={incident?.date} /> */}
                                    <ClientOnly>
                                        {() => <Timestamp date={incident?.date} />}
                                    </ClientOnly>
                                    {/* <ClientOnly>
                                        {() => <Timestamp date={incident?.date} />}
                                    </ClientOnly> */}
                                </div>
                            </div>
                            <br />
                            <div className='m max-w-full md:max-w-1/2 lg:max-w-3/5'>
                                <TwitchClip clip={incident?.clip_link} className='rounded-lg w-full h-72 lg:h-96 lg:w-full' />
                                {/* <ClientOnly>
                                    {(() =>
                                        <TwitchClip clip={incident?.clip_link} className='rounded-lg w-full h-72 lg:h-96 lg:w-full' />
                                    )}
                                </ClientOnly> */}
                            </div>
                            <br />
                            <p className='p-3 rounded-md bg-black/20 text-neutral-200'>{incident?.description}</p>
                            <br />
                            {
                                user
                                    ?
                                    <>
                                        <Form method='post' className='font-bold font-mono transition-all inline mr-2 pr-3 pl-2 py-1 bg-black duration-75 ease-in-out mb-2 text-lg rounded-xl border-white border-1 hover:border'>
                                            <input type="hidden" name="id" value={incident?.id} />
                                            <button name='_action' value={user_liked_post === true ? 'unlike' : 'like'} className={user_liked_post ? ' text-purple-500 inline' : isLiking ? 'text-purple-500 inline' : 'text-white inline'}> <img title='despairs' src="https://cdn.7tv.app/emote/613265d8248add8fdae01ad0/3x.webp" className='inline ml-0.5 w-[29px] rounded-2xl -translate-y-[1.5px]' />
                                                {
                                                    isLiking
                                                        ?
                                                        incident.awares.length + 1
                                                        :
                                                        (isUnliking
                                                            ?
                                                            incident.awares.length - 1
                                                            :
                                                            incident.awares.length)
                                                }
                                            </button>
                                        </Form>
                                    </>
                                    :
                                    <>
                                        <div className="font-bold font-mono transition-all inline mr-2 px-2 py-1 bg-black duration-150 ease-in-out mb-2 text-lg rounded-lg"><img title='despairs' src="https://cdn.7tv.app/emote/613265d8248add8fdae01ad0/3x.webp" className='inline ml-0.5 w-[29px] -translate-y-[1.5px]' /> {incident.awares.length}</div>
                                    </>
                            }
                            <div className='mt-4 font-mono md:inline md:ml-3'>
                                <span className='mr-2 px-2 py-1'>{incident?.clip_views} views.</span>
                                <br className='md:hidden' />
                                <span className='mr-2 px-2 py-1'>clipped by {incident?.clipper}.</span>
                            </div>
                        </div>
                        <div className='w-full md:rounded-md md:w-1/2 lg:w-3/5 filter backdrop-blur-lg bg-transparent bg-opacity-80'>
                            <h1 className='font-extrabold text-xl p-4'>
                                Thoughts? <span className='float-right text-sm'>{incident?.comments?.length} thoughts</span>
                            </h1>
                            {
                                user
                                    ?
                                    <>
                                        <div>
                                            <button className='px-3 py-1 mx-3 rounded-lg hover:bg-black/50 bg-black/30' onClick={openModal}>Comment</button>
                                            <Transition appear show={isOpen} as={Fragment}>
                                                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                                                    <Transition.Child
                                                        as={Fragment}
                                                        enter="ease-out duration-300"
                                                        enterFrom="opacity-0"
                                                        enterTo="opacity-100"
                                                        leave="ease-in duration-200"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                                                    </Transition.Child>

                                                    <div className="fixed inset-0 overflow-y-auto">
                                                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                                                            <Transition.Child
                                                                as={Fragment}
                                                                enter="ease-out duration-300"
                                                                enterFrom="opacity-0 scale-95"
                                                                enterTo="opacity-100 scale-100"
                                                                leave="ease-in duration-200"
                                                                leaveFrom="opacity-100 scale-100"
                                                                leaveTo="opacity-0 scale-95"
                                                            >
                                                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl filter backdrop-blur-lg bg-white/20 p-6 text-left align-middle shadow-xl transition-all">
                                                                    <Dialog.Title
                                                                        as="h3"
                                                                        className="text-lg font-medium leading-6 text-white"
                                                                    >
                                                                        Comment <img className='inline ml-1' src='https://cdn.7tv.app/emote/611666b703dae26bc706ef22/1x.webp' />
                                                                    </Dialog.Title>
                                                                    <Dialog.Description>
                                                                        <div className="mt-4">
                                                                            <Form method="post" className='inline'>
                                                                                <textarea name='content' maxLength={420} className='bg-black/80 w-full p-2 rounded-lg text-white' rows={3}></textarea>
                                                                                <br />
                                                                                <input type="hidden" name="id" value={incident?.id} />
                                                                                <small>You can use any 7tv emote in xQc's emote set.</small>
                                                                                <br />
                                                                                <button
                                                                                    name='_action'
                                                                                    value={'comment'}
                                                                                    onClick={closeModal}
                                                                                    disabled={transition.submission}
                                                                                    className="inline-flex mt-2 justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-black"                                            >
                                                                                    Publish!
                                                                                </button>
                                                                            </Form>
                                                                        </div>
                                                                    </Dialog.Description>
                                                                </Dialog.Panel>
                                                            </Transition.Child>
                                                        </div>
                                                    </div>
                                                </Dialog>
                                            </Transition>
                                        </div>
                                        <br />
                                    </>
                                    :
                                    <>
                                        <>
                                            <div className='border-t-1 border border-black grid place-items-center p-1'>
                                                You can login with twitch to give your thoughts
                                            </div>
                                        </>
                                    </>
                            }
                            {
                                incident?.comments?.length > 0
                                    ?
                                    <>
                                        <div className='bg-white/5'>
                                            {incident?.comments?.map((com) =>
                                                <div hidden={transition.submission && transition.submission?.formData.get("_action") === "delete_comment" && transition.submission?.formData.get("comment_id") === com.id} className={com?.content?.includes(user?.display_name) ? 'bg-red-600/10 hover:bg-red-600/20 duration-150 transition-all ease-in-out p-2 md:p-3.5 border-l-2 border-red-400' : 'bg-black/10 hover:bg-black/20 duration-150 transition-all ease-in-out p-2 md:p-3.5 border-l-2 border-red-400'}>
                                                    <span className='float-right'>
                                                        {
                                                            com.can_user_modify
                                                                ?
                                                                <>
                                                                    {com.modify_type === "author"
                                                                        ?
                                                                        <>
                                                                            <Form method="post" className='inline'>
                                                                                <input type="hidden" name="comment_id" value={com?.id} />
                                                                                <input type="hidden" name="incident_id" value={incident?.id} />
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        if (!confirm("Are you sure you want to remove this comment?")) {
                                                                                            e.preventDefault()
                                                                                        }
                                                                                    }}
                                                                                    name='_action'
                                                                                    value={'delete_comment'}
                                                                                    className="text-red-600 text-lg ml-2">
                                                                                    <RiChatDeleteLine className='hover:bg-red-600/40 rounded-xl' />

                                                                                </button>
                                                                            </Form>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <Form method="post" className='inline'>
                                                                                <input type="hidden" name="comment_id" value={com?.id} />
                                                                                <input type="hidden" name="incident_id" value={incident?.id} />
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        if (!confirm("Are you sure you want to removethis comment?")) {
                                                                                            e.preventDefault()
                                                                                        }
                                                                                    }}
                                                                                    name='_action'
                                                                                    value={'delete_comment'}
                                                                                    className="text-red-600 text-lg ml-2">
                                                                                    <RiChatDeleteLine className='hover:bg-red-600/40 rounded-xl' />
                                                                                </button>
                                                                            </Form>
                                                                        </>
                                                                    }
                                                                </>
                                                                :
                                                                <>
                                                                </>
                                                        }
                                                    </span>
                                                    <div className='inline mr-1'>
                                                        <span className='text-neutral-400 hidden md:inline mr-0.5 text-sm font-light'>
                                                            <ClientOnly>
                                                                {() => <Timestamp relative className="hidden md:inline md:float-right font-mono my-auto" date={com?.created_at} />}
                                                            </ClientOnly>
                                                        </span>
                                                        <Username user={com?.creator} />:
                                                    </div>
                                                    <div className='inline'>
                                                        <CommentI content={com?.content} emotes={emotes} viewer={user} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                    :
                                    <>
                                        {
                                            user
                                                ?
                                                <>
                                                    <div className='grid place-items-center p-10'>
                                                        Be the first to give your thoughts on this!
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div className='border-t-1 border border-black grid place-items-center p-10'>
                                                        No thoughts.........
                                                    </div>
                                                </>
                                        }
                                    </>
                            }
                        </div>
                    </div>
                </>
                :
                <>

                </>
            }
        </>
    )
}

export function ErrorBoundary({ error }) {
    console.error(error.message);
    return (
        <>
            <div className='grid place-items-center bg-red-700/50 border-red-600 border-r-4 border-l-4 p-10 rounded-2xl font-extrabold'>
                <h1 className="text-4xl">
                    bruh
                </h1>
                <br />
                <div>
                    this might not exist lmao
                </div>
                {error.message}
                <br />
                <img src="https://cdn.7tv.app/emote/60afccdeebfcf7562e289afa/4x.webp" />
                <br />
                <Link className="bg-black/40 px-4 py-1 rounded-xl hover:underline" to="/i">
                    Back
                </Link>
            </div>
        </>
    );
}


//<div className='my-2 bg-neutral-900/50 p-4 py-2'>
//<div className='text-red-600 font-bold mb-2'>dkarsonn <span className='text-neutral-400 mr-0.5 text-sm font-light'>7m ago</span></div>
//<div className='mb-2'>
//   <img src='https://cdn.7tv.app/emote/6042089e77137b000de9e669/1x.webp' className='inline ml-1' /> best clip
//</div>
//{/* <div className='inline text-xs rounded-sm bg-green-500/80 px-1.5'>Like</div> */}
//</div>
//<div className='my-2 bg-neutral-900/50 p-2 py-2 border-l-4 border-red-600'>
//<div className='inline text-xs rounded-xl bg-red-600/80 px-2 mr-1'>shit take</div>
//{/* <div className='inline text-xs rounded-xl bg-sky-500/80 px-1.5'>5 likes</div> */}
//<br />
//<span className='inline text-yellow-500 font-bold'>
//    QaXcZ
//</span>:
//what a shit clip
//<span className='text-neutral-400 mr-0.5 float-right'>7m ago</span>
//<br />
//{/* <div className='inline text-xs rounded-sm bg-green-500/80 px-1.5'>Like</div> */}
//</div>
//<div className='my-2 bg-neutral-900/50 p-2 py-2 border-l-4 border-blue-600'>
//<div className='inline text-xs rounded-xl bg-blue-600/80 px-2 mr-1'>GOD take</div>
//{/* <div className='inline text-xs rounded-xl bg-sky-500/80 px-1.5'>5 likes</div> */}
//<br />
//<span className='inline text-white font-bold'>
//    xQc
//</span>:
//@QaXcZ shut the fuck up bitch blah blah what the heck man what are you thinking going around saying shit like this you know for a fact that you are  a retrard round saying shit like this you know for a fact that you are  a retrard round saying shit like this you know for a fact that you are  a retrard round saying shit like this you know for a fact that you are  a retrard
//<span className='text-neutral-400 mr-0.5 float-right'>7m ago</span>
//<br />
//{/* <div className='inline text-xs rounded-sm bg-green-500/80 px-1.5'>Like</div> */}
//</div>