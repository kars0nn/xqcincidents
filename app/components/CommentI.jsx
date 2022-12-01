import { Menu } from '@headlessui/react'
import { Link, Form } from '@remix-run/react'
import { useEffect } from 'react'
import { BsTwitch } from 'react-icons/bs'
import reactStringReplace from 'react-string-replace'

export function CommentI({ emotes, content}) {
    let emotesFound = []
    emotes.forEach((e) => {
        if(content.split(" ").includes(e.name)){
            emotesFound.push({name: e.name, url: `https://cdn.7tv.app/emote/${e.id}/3x.webp`, width: e.width, height: e.height})
        } else {
            
        }
    })

    emotesFound.forEach((e) => {
        content = reactStringReplace(content, e.name, (match, index) => (
            <img title={e.name} className={`inline-block`} src={e.url} width={e.width.join(", ")} height={e.height.join(", ")} />
        ))
    })

    return (
        <>
            {content}
        </>
    )
}