import { Menu } from '@headlessui/react'
import {Link} from '@remix-run/react'

export function DropdownMenu({ user }) {
    return (
        <div className="float-right text-right">
            <Menu>
                <Menu.Button className="bg-white/10 py-2 px-4 ">Account</Menu.Button>
                <Menu.Items className="z z-50 p-2 absolute filter backdrop-blur-md right-2 mt-3 bg-white/5 duration-75 ease-in-out transition-all">
                    <Menu.Item className="bg-black/20 my-1 flex w-full items-center hover:bg-black/10 duration-75 ease-in-out transition-all p-3 ">
                        {({ active }) => (
                            <Link
                                className={`${active && 'bg-blue-500'}`}
                                to="/protected"
                            >
                                Account settings
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item className="bg-black/20 my-1 flex w-full items-center hover:bg-black/10 duration-75 ease-in-out transition-all p-3 ">
                        {({ active }) => (
                            <a
                                className={`${active && 'bg-blue-500'}`}
                                href="/account-settings"
                            >
                                Documentation
                            </a>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Menu>
        </div>
    )
}