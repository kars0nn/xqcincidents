import { Menu } from '@headlessui/react'
import { Link, Form } from '@remix-run/react'
import { BsTwitch } from 'react-icons/bs'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

export function Footer({ user }) {
    return (
        <>
            <br />
            <br />
            <br />
            <div className="grid place-items-center p-10 bottom-0">
                <p className='text-neutral-700'>
                    Made by dkarsonn (karson#0001)
                    <br />
                    Report any bugs to me on discord.
                    <br />
                    <br />
                    Questions about making an account?
                    <br /> <Link className='text-blue-500 hover:underline' to="about">Click here for account questions</Link>
                </p>
            </div>
        </>
    )
}