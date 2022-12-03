import { Menu } from '@headlessui/react'
import { Link, Form } from '@remix-run/react'
import { BsTwitch } from 'react-icons/bs'

export function Username({ user, small }) {
    return (
        <>
            {
                user.role === "MOD" || user.role === "ADMIN"
                    ?
                    user.role === "MOD" ?
                        <>
                            <img
                                className={small ? 'inline w-[12px] -translate-y-[1px] ml-[2px] mr-[1px]' : 'inline w-[18px] -translate-y-[1px] ml-[3px] mr-[2px]'}
                                src="/badges/mod.png"
                            />
                            <img
                                className={small ? 'inline w-[12px] -translate-y-[1px] mr-[1px]' : 'inline w-[18px] -translate-y-[1px] mr-[2px]'}
                                src="/badges/weird.png"
                            />
                        </>

                        : user.role === "ADMIN" &&
                        <img
                            className={small ? 'inline w-[12px] -translate-y-[1px] ml-[2px] mr-[1px]' : 'inline w-[18px] -translate-y-[1px] ml-[3px] mr-[2px]'}
                            src="/badges/admin.png"
                        />
                    :
                    <></>
            }
            <img
                title={user.stvbadge_tooltip}
                className={small ? 'inline w-[12px] -translate-y-[1px] mr-[1px]' : 'inline w-[18px] -translate-y-[1px] mr-[2px]'}
                src={user.stvbadge_url}
            />
            <div
                title={user.role === 'ADMIN' ? ' Site Admin' : user.role === 'MOD' ? 'Moderator' : user.stvbadge_tooltip === '7TV Admin' || user.stvbadge_tooltip === '7TV Owner' || user.stvbadge_tooltip === '7TV Moderator' ? '7TV VIP' : 'User'}
                className={user.role === 'ADMIN' ? ' text-amber-400 inline font-bold' : user.role === 'MOD' ? 'text-red-600 inline font-bold' : user.stvbadge_tooltip === '7TV Admin' || user.stvbadge_tooltip === '7TV Owner' || user.stvbadge_tooltip === '7TV Moderator' ? 'text-cyan-400 font-bold' : ' text-neutral-300 inline font-bold'}
            >
                {user.display_name ?? 'a user :)'}
            </div>
        </>
    )
}