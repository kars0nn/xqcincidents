import { fetch } from "@remix-run/node"


export const loader = async ({request, params}) => {
    let res = await fetch('https://api.7tv.app/v2/cosmetics?user_identifier=twitch_id')
    let parsed = await res.json()

    let p = await params.id

    let user = {
        id: p,
        badge: null
    }

    // let wahtthe = parsed.badges.some((b) => b.users.some((u) => u === p))

    // if(wahtthe) {

    // } 

    parsed.badges.forEach((e) => {
        let check = e.users.some((b) => b === p )

        if(check) {
            user.badge = e.urls[0]

           console.log(user)
        } else {
            console.log(check)
        }
    })
    //return wahtthe
}