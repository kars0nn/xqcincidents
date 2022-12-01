import { Menu } from '@headlessui/react'
import { Link, Form } from '@remix-run/react'
import { BsTwitch } from 'react-icons/bs'

export function Username({ user, small }) {
    return (
        <>
            <img title={user.stvbadge_tooltip} className={small ? 'inline w-[12px] -translate-y-[1px]' : 'inline w-[18px] -translate-y-[1px]'} src={user.stvbadge_url} /> <div title={user.role === 'ADMIN' ? ' Site Admin' : user.role === 'MOD' ? 'Moderator' : user.stvbadge_tooltip === '7TV Admin' || user.stvbadge_tooltip === '7TV Owner' || user.stvbadge_tooltip === '7TV Moderator' ? '7TV VIP' : 'User'} className={user.role === 'ADMIN' ? ' text-amber-400 inline font-bold' : user.role === 'MOD' ? 'text-red-600 inline font-bold' : user.stvbadge_tooltip === '7TV Admin' || user.stvbadge_tooltip === '7TV Owner' || user.stvbadge_tooltip === '7TV Moderator' ? 'text-cyan-400 font-bold' : ' text-neutral-300 inline font-bold'}>{user.display_name ?? 'a user :)'}</div>
        </> 
    )
}