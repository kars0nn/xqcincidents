import { useEffect, useState } from 'react'
import reactStringReplace from 'react-string-replace'
// import { nazi, nword } from 'expletives'

export function CommentI({ emotes, content }) {
    // let emotesFound = []
    // emotes.forEach((e) => {
    //     if (content.toString().split(" ").includes(e.name)) {
    //         emotesFound.push({ name: e.name, url: `https://cdn.7tv.app/emote/${e.id}/1x.webp`, width: e.width, height: e.height })
    //     } else {

    //     }
    // })

    function nword(text) {
        const r = new RegExp(`[nN]+[iI1lL|]+[GgKkQq469]+[Ee3Aa4iI]+[RrAa4]+[sS]?`)
        return r.test(text)
    }
    function nazi(text) {
        const r = new RegExp(`[nN]+[a4A|]+[zZ]+[Ii1l]+[sS]?`)
        return r.test(text)
    }
    

    // emotesFound.forEach((e) => {
    //     content = reactStringReplace(content, e.name, (match, index) => (
    //         <img title={e.name} className={`inline-block`} src={e.url} width={e.width.join(", ")} height={e.height.join(", ")} />
    //     ))
    // })

    function nword(text) {
        const r = new RegExp(`[nN]+[iI1lL|]+[GgKkQq469]+[Ee3Aa4iI]+[RrAa4]+[sS]?`)
        return r.test(text)
    }
    function nazi(text) {
        const r = new RegExp(`[nN]+[a4A|]+[zZ]+[Ii1l]+[sS]?`)
        return r.test(text)
    }

    let isnsfw = nazi(content) || nword(content)

    const [flag, setflag] = useState(isnsfw);

    let show = () => {
        setflag(!flag)
    }

    return (
        <>
            {
                flag
                    ?
                    <button onClick={show} className='text-xs text-red-600'>SHOW [NSFW VERY BAD! DO NOT CLICK IF ON STREAM]</button>
                    :
                    <></>
            }
            <content className={flag ? 'filter blur-sm' : ''}>
                {content}
            </content>
        </>
    )
}