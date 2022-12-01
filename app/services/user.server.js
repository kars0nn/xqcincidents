import { db } from './prisma.server'
import { encryptData, decryptData } from "./encrypt.server";
import { fetch } from "@remix-run/node"

export async function findUserByTwitchId(id) {
    let user = await db.user.findUnique({
        where: {
            twitch_id: id
        },
        select: {
            email: false,
            id: true,
            twitch_id: true,
            display_name: true,
            profile_image: true,
            role: true,
            created_at: true,
            updated_at: true,
            name_color: true,
            badges: true,
            is_subscriber: true,
            is_verified: true,
            temp_token: true
        }
    })

    return user
}

export async function findUserById(id) {
    let user = await db.user.findUnique({
        where: {
            id: id
        },
        select: {
            email: false,
            id: true,
            twitch_id: true,
            display_name: true,
            profile_image: true,
            role: true,
            created_at: true,
            updated_at: true,
            name_color: true,
            badges: true,
            is_subscriber: true,
            is_verified: true,
            temp_token: true
        }
    })

    return user
}

export async function getUserBadge(id) {
    let res = await fetch('https://api.7tv.app/v2/cosmetics?user_identifier=twitch_id')
    let parsed = await res.json()

    console.log(id)

    let badge = {
        name: null,
        tooltip: null,
        url: null
    }

    parsed.badges.forEach((e) => {
        let check = e.users.some((b) => b === id)

        if (check) {
            console.log(e.name)
            badge.name = e.name
            badge.tooltip = e.tooltip
            badge.url = e.urls[2][1]
        }
    })

    return badge
}