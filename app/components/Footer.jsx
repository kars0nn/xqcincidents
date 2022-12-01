import { Menu } from '@headlessui/react'
import { Link, Form } from '@remix-run/react'
import { BsTwitch } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

export function Footer({ user }) {
    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
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
                                        Hey there! 👋
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-300">
                                            Before you sign up - would you like us to keep your email for future features like email notifications?
                                            Your privacy is respected and your email will be encrypted so nobody can see it.
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        {/* <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={closeModal}
                                            >
                                                Got it, thanks!
                                            </button> */}
                                        <Form method="post" className='inline mr-5'>
                                            <button name='_action' value="accept" type="submit" className='px-4 py-2 rounded-lg bg-green-600/40 hover:bg-green-600/60 transition-all duration-150 ease-in-out'>
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
            <br />
            <br />
            <br />
            <div className="grid place-items-center p-10">
                {
                    user
                        ?
                        <>
                            <div className="float-right">
                                <Form action='/logout' method="post">
                                    <button className='bg-purple-600 p-2 rounded-lg text-white border-b-purple-900 border-b-2 '><BsTwitch className="inline" /> Logout</button>
                                </Form>
                            </div>
                            <br />
                            <p className='text-neutral-400'>
                                Made by dkarsonn (karson#0001)
                                <br />
                                Report any bugs to me on discord.
                            </p>
                        </>
                        :
                        <>
                            <div className="float-right">
                                {/* <button onClick={openModal} className='bg-purple-600 font-bold p-2 rounded-lg text-white border-b-purple-900 border-b-2 '><BsTwitch className="inline" /> Login with twitch</button> */}
                                <Form action='/auth/twitch' method="post">
                                    <button className='bg-purple-600 font-bold p-2 rounded-lg text-white border-b-purple-900 border-b-2 '><BsTwitch className="inline" /> Login with twitch</button>
                                </Form>
                            </div>
                            <br />
                            <p className='text-neutral-400'>
                                Made by dkarsonn (karson#0001)
                                <br />
                                Report any bugs to me on discord.
                            </p>
                        </>
                }
            </div>
        </>
    )
}