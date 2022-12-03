import { TwitchClip } from 'react-twitch-embed';
import { Link, useLoaderData, Form, useActionData, useTransition } from '@remix-run/react'
import { ClientOnly } from 'remix-utils';
import { authenticator, isUserLoggedIn, twitchStrategy } from '~/services/auth.server';
import { acceptIncident, getClipInfo, getIncident, rejectIncident } from '~/services/incident.server';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import Timestamp from 'react-timestamp'

export const loader = async ({ request, params }) => {
    const id = params.id
    let user = await isUserLoggedIn(request)
    if (user.error) return user.error;
    let incident = await getIncident(id);
    return incident
};

export async function action({ request }) {
    let errors = {}
    let user = await isUserLoggedIn(request)
    if (user.error) return user.error;
    let formData = await request.formData();
    let { _action, ...values } = Object.fromEntries(formData);

    if (_action === 'accept') {
        console.log(values)
        let updated = await acceptIncident(values?.id ?? 'none', values?.name, values?.description)

        if (updated.status === 'ACCEPTED') return { success: 'accepted!' }
    } else if (_action === 'reject') {
        await rejectIncident(values?.id ?? 'none')

        return { success: 'rejected!' }
    }
}

export default function Incident() {
    let data = useLoaderData()
    let status = data?.status
    let [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState(data?.name);
    const [description, setDescription] = useState(data?.description);
    const transition = useTransition();

    if(transition?.submission) {
        openSuccessModal()
    }

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }


    let [isSuccessOpen, setIsSOpen] = useState(data?.status === 'ACCEPTED' || data?.status === 'REJECTED')

    function closeSuccessModal() {
        setIsSOpen(false)
    }

    function openSuccessModal() {
        setIsSOpen(true)
    }

    return (
        <div className='grid place-items-center'>
            <ClientOnly>
                {() => <>Submitted <Timestamp relative date={data.created_at} /></>}
            </ClientOnly>
            <small>you may edit typos</small>
            <br />
            <div className='p-6 w-full filter backdrop-blur-lg bg-white/5 md:rounded-lg bg-opacity-80'>
                <h1 className='font-extrabold text-3xl'>
                    <input type="text" onChange={(e) => setTitle(e.target.value)} className='bg-transparent hover:bg-black/20 hover:p-2 rounded-lg transition-all duration-100 ease-in-out' defaultValue={title} />
                </h1>
                <div className='font-bold text-xl text-neutral-400'>
                    <ClientOnly>
                        {() => <Timestamp date={data.date} options={{ format: "mm/dd/yyyy" }} />}
                    </ClientOnly>
                </div>
                <br />
                <div className='m max-w-full md:max-w-1/2 lg:max-w-3/5'>
                    <ClientOnly>
                        {(() =>
                            <TwitchClip clip={data?.clip_link} className='rounded-lg w-full h-72 lg:h-96 lg:w-full' />
                        )}
                    </ClientOnly>
                </div>
                <br />
                <input onChange={(e) => setDescription(e.target.value)} className='p-3 rounded-md bg-black/20 text-neutral-200 w-full hover:p-5 transition-all duration-100 ease-in-out' type="text" defaultValue={description} />
                <br />
                <br />
                <span className="font-bold font-mono text-lg"><img title='awares' src="https://cdn.7tv.app/emote/613265d8248add8fdae01ad0/1x.webp" className='inline ml-0.5' /> 0</span>

            </div>
            <br />
            <br />
            <div className="flex">
                <Transition appear show={isSuccessOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={closeSuccessModal}>
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
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl filter backdrop-blur-2xl bg-neutral-200/20 p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-white"
                                        >
                                            Success!
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-300">
                                                Incident was {data?.status}
                                            </p>
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black"
                                                onClick={closeSuccessModal}
                                            >
                                                Got it, thanks!
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
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
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl filter backdrop-blur-xl bg-neutral-200/20 p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-white"
                                        >
                                            Are you sure you want to accept?
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-300">
                                                Please make sure everything is working correctly.
                                            </p>
                                        </div>

                                        <div className="mt-4">
                                            <Form method="post" className='inline mr-5'>
                                                <input type='hidden' name="id" value={data.id} />
                                                <input type="hidden" name="name" value={title} />
                                                <input type="hidden" name="description" value={description} />
                                                <button onClick={closeModal} name='_action' value="accept" type="submit" className='px-4 py-2 rounded-lg bg-green-600/40 hover:bg-green-600/60 transition-all duration-150 ease-in-out'>
                                                    Accept
                                                </button>
                                            </Form>
                                            <button
                                                onClick={closeModal}
                                                className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-black"                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
                {
                    status === 'ACCEPTED' || status === 'REJECTED'
                        ?
                        <>
                        </>
                        :
                        <>
                            <div className='mx-5'>
                                <button onClick={openModal} className='px-4 py-2 rounded-lg bg-green-600/40 hover:bg-green-600/60 transition-all duration-150 ease-in-out'>
                                    Accept
                                </button>
                            </div>
                            <div className='mx-5'>
                                <Form method="post">
                                    <input type='hidden' name="id" value={data.id} />
                                    <button name='_action' value="reject" type="submit" className='px-4 py-2 rounded-lg bg-red-600/40 hover:bg-red-600/60 transition-all duration-150 ease-in-out'>
                                        Reject
                                    </button>
                                </Form>
                            </div>
                        </>
                }
            </div>
        </div>
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