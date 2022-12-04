import { useEffect, useState } from 'react'
import reactStringReplace from 'react-string-replace'
// import { nazi, nword } from 'expletives'

export function CommentI({ emotes, content, id }) {
    let emotesFound = []
    emotes.forEach((e) => {
        if (content.split(" ").includes(e.name)) {
            emotesFound.push({ name: e.name, url: `https://cdn.7tv.app/emote/${e.id}/1x.webp`, width: e.width, height: e.height })
        } else {

        }
    })

    // function nword(text) {
    //     const r = new RegExp(`[nN]+[iI1lL|]+[GgKkQq469]+[Ee3Aa4iI]+[RrAa4]+[sS]?`)
    //     return r.test(text)
    // }
    // function nazi(text) {
    //     const r = new RegExp(`[nN]+[a4A|]+[zZ]+[Ii1l]+[sS]?`)
    //     return r.test(text)
    // }

    // function emojiSearcher(text) {
    // 	return emotesFound.map((emote) => {
    // 		let regEx = new RegExp(emote.name, 'g')

    // 		return regEx.test(text) ? emojiReplacer(text, emote, regEx, emote.width.join(", "), emote.height.join(", ")) : null
    // 	}).join('')
    // }

    // function emojiReplacer(text, replacement, regEx, height, width) {

    // 	let replacementString = `<img title="${replacement.name}" src="${replacement.url}" style="inline-block" height=${height} width=${width} />`

    // 	return text.toString().replace(regEx, replacementString)
    // }

    // console.log(emojiSearcher(content))

    // content = {__html: emojiSearcher(content)}

    emotesFound.forEach((e) => {
        content = reactStringReplace(content, e.name, (match, index) => (
            <img title={e.name} className={`inline-block`} src={e.url} width={e.width.join(", ")} height={e.height.join(", ")} />
        ))
    })

    // content = reactStringReplace(content, 'OMEGALUL', (match, index) => (
    //     <span>{match}</span>
    // ))

    // let isnsfw = nazi(content) || nword(content)

    // const [flag, setflag] = useState(isnsfw);

    // let show = () => {
    //     setflag(!flag)
    // }

    return (
        <div key={id} className="inline">
            {
                flag
                    ?
                    <button onClick={show} className='text-xs text-red-600'>SHOW [NSFW VERY BAD! DO NOT CLICK IF ON STREAM] </button>
                    :
                    <></>
            }
            <div key={id + 'fhdsjk'} className={flag ? 'inline filter blur-sm' : 'inline'}>
                {
                    content
                }
            </div>
        </div>
    )
}