import { useEffect, useState } from 'react'
// import { nazi, nword } from 'expletives'

export function CommentI({ emotes, content, id }) {
    let emotesFound = [];
    emotes.map((e) => {
        if (content?.split(" ").includes(e?.name)) {
            emotesFound?.push({ name: e?.name, url: `https://cdn.7tv.app/emote/${e?.id}/1x.webp`, width: e?.width, height: e?.height })
        } else {

        }
    })

    // Split the input string into an array of words
    const inputWords = content.split(' ');

    // Loop through each word in the input array and check if it matches an emote name
    const outputWords = inputWords.map(word => {
        // Loop through each emote and check if the current word matches the emote name
        for (const emote of emotesFound) {
            if (word === emote.name) {
                // If the current word matches the emote name, return the HTML image tag
                return (
                    <span>
                        <img src={emote.url} alt={emote.name} title={emote.name} style={{ display: 'inline' }} width={emote.width} height={emote.height} />
                        {' '}
                    </span>
                );
            }
        }

        // If the current word does not match any emote name, return the original word
        return word;
    });

    // Join the output words back into a single string
    content = outputWords.map(word => word);

    function nword(text) {
        const r = new RegExp(`[nN]+[iI1lL|]+[GgKkQq469]+[Ee3Aa4iI]+[RrAa4]+[sS5]?`)
        return r.test(text)
    }
    function nazi(text) {
        const r = new RegExp(`[nN]+[a4A|]+[zZ]+[Ii1l]+[sS5]?`)
        return r.test(text)
    }

    let isnsfw = nazi(content) || nword(content)

    const [flag, setflag] = useState(isnsfw);

    let show = () => {
        setflag(!flag)
    }

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
                <span>{content}</span>
            </div>
        </div>
    )
}