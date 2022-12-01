//moderate incidents -----

import { db } from "./prisma.server"
import { fetch } from "@remix-run/node";

async function getAccessToken() {
    let res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_API_CLIENT}&client_secret=${process.env.TWITCH_API_SECRET}&grant_type=client_credentials`, {
        method: 'POST'
    })

    let f = await res.json()

    return f
}

// {
//     [1]   access_token: '5l3440xuf1qlhnnazgbcip0em3izsm',
//     [1]   expires_in: 5071925,
//     [1]   token_type: 'bearer'
//     [1] }

export async function getClipInfo(slug) {
    let token = await getAccessToken()
    let res = await fetch('https://api.twitch.tv/helix/clips?id=' + slug, {
        headers: {
            "Authorization": "Bearer " + token.access_token,
            "Client-Id": process.env.TWITCH_API_CLIENT
        }
    })

    let data = await res.json()

    return data
}

export async function submitIncident(data, usa, token) {
    if(!token) return {error: 'unauthorized'}
    let ct = await checkToken(usa.id, token)
    if(!ct) return {error: 'unauthorized'}
    let { clip, description, title } = data
    if (!clip) return null;
    if (!usa) return null;

    let clipData = await getClipInfo(clip)

    let user = await db.user.findUnique({
        where: {
            id: usa?.id
        }
    })

    return await db.incident.create({
        data: {
            name: title ?? null,
            clip_link: clip ?? null,
            description: description ?? 'description',
            submitter_id: user?.id ?? null,
            type: 'STREAM',
            date: clipData?.data[0]?.created_at ?? null,
            clipper: clipData?.data[0]?.creator_name ?? null,
            clip_views: clipData?.data[0]?.view_count ?? null,
            thumbnail_url: clipData?.data[0]?.thumbnail_url ?? null,
            game_id: clipData?.data[0]?.game_id ?? null
        }
    })
}

export async function acceptIncident(id) {
    return await db.incident.update({
        where: {
            id: id
        },
        data: {
            status: 'ACCEPTED'
        }
    })
}

export async function rejectIncident(id) {
    return await db.incident.update({
        where: {
            id: id
        },
        data: {
            status: 'REJECTED'
        }
    })
}

// get incidents -----

export async function getIncident(id) {
    return await db.incident.findUnique({
        where: {
            id: id
        },
        include: {
            submitter: {
                select: {
                    profile_image: true,
                    display_name: true,
                    badges: true,
                    stvbadge_url: true,
                    stvbadge_tooltip: true,
                    name_color: true,
                    role: true,
                    is_subscriber: true,
                    is_verified: true,
                    id: true,
                    is_banned: true,
                }
            },
            comments: {
                include: {
                    creator: {
                        select: {
                            display_name: true,
                            profile_image: true,
                            id: true,
                            name_color: true,
                            badges: true,
                            stvbadge_url: true,
                            stvbadge_tooltip: true,
                            role:true
                        }
                    }
                }
            },
            awares: {
                select: {
                    display_name: true,
                    id: true,
                    profile_image: true
                }
            }
        }
    })
}

export async function getAllIncidents() {
    return await db.incident.findMany({
        where: {
            status: 'ACCEPTED'
        },
        select: {
            submitter: {
                select: {
                    profile_image: true,
                    display_name: true,
                    badges: true,
                    stvbadge_url: true,
                    stvbadge_tooltip: true,
                    name_color: true,
                    is_subscriber: true,
                    is_verified: true,
                    id: true,
                    is_banned: true,
                    role:true
                }
            },
            name: true,
            description: true,
            created_at: true,
            awares: {
                select: {
                    id: true
                }
            },
            severity_level: true,
            id: true,
            type: true,
            comments: {
                select: {
                    id: true
                }
            },
            clip_views: true,
            clipper: true,
            thumbnail_url: true,
            game_id: true,
            date: true
        },
        orderBy: {
            date: 'desc'
        }
    })
}


export async function getAllIncidentsPending() {
    return await db.incident.findMany({
        where: {
            status: 'PENDING'
        },
        include: {
            submitter: {
                select: {
                    profile_image: true,
                    display_name: true,
                    badges: true,
                    name_color: true,
                    role: true,
                    is_subscriber: true,
                    is_verified: true,
                    id: true,
                    is_banned: true,
                    stvbadge_url: true,
                    stvbadge_tooltip: true,
                }
            }
        }
    })
}

export async function getLatestIncident() {
    return await db.incident.findFirst({
        where: {
            status: 'ACCEPTED'
        },
        select: {
            submitter: {
                select: {
                    profile_image: true,
                    display_name: true,
                    badges: true,
                    stvbadge_url: true,
                    stvbadge_tooltip: true,
                    name_color: true,
                    id: true,
                    is_banned: true,
                     role: true
                }
            },
            name: true,
            description: true,
            created_at: true,
            awares: {
                select: {
                    id: true
                }
            },
            severity_level: true,
            id: true,
            type: true,
            comments: {
                select: {
                    id: true
                }
            },
            clip_views: true,
            clipper: true,
            thumbnail_url: true,
            game_id: true,
            date: true
        },
        orderBy: {
            date: 'desc'
        }
    })
}

// user interaction

export async function hasUserLikedPost(user_id, incident_id) {
    if (!user_id) return false;
    if (!incident_id) return false;
    let incident = await db.incident.findUnique({
        where: {
            id: incident_id
        },
        select: {
            awares: {
                select: {
                    id: true
                }
            }
        }
    })

    return incident.awares.some(a => a.id === user_id)
}

export async function addAwareToIncident(user_id, incident_id, token) {
    if(!token) return {error: 'unauthorized'}
    let ct = await checkToken(user_id, token)
    if(!ct) return {error: 'unauthorized'}
    let check = await hasUserLikedPost(user_id, incident_id)

    if (check) {
        return null
    } else {
        return await db.incident.update({
            where: {
                id: incident_id
            },
            data: {
                awares: {
                    connect: {
                        id: user_id
                    }
                }
            }
        })
    }
}

export async function removeAwareFromIncident(user_id, incident_id, token) {
    if(!token) return {error: 'unauthorized'}
    let ct = await checkToken(user_id, token)
    if(!ct) return {error: 'unauthorized'}
    let check = await hasUserLikedPost(user_id, incident_id)

    if (check) {
        return await db.incident.update({
            where: {
                id: incident_id
            },
            data: {
                awares: {
                    disconnect: {
                        id: user_id
                    }
                }
            }
        })
    } else {
        return null
    }
}

export async function addCommentToIncident(user_id, incident_id, content, token) {
    if(!token) return {error: 'unauthorized'}
    let ct = await checkToken(user_id, token)
    if(!ct) return {error: 'unauthorized'}
    return await db.comment.create({
        data:{
            content: content,
            creator_id: user_id,
            incident_id: incident_id
        }
    })
}

export async function removeCommentFromIncident(comment_id, user_id, incident, token) {
    if(!token) return {error: 'unauthorized'}
    let ct = await checkToken(user_id, token)
    if(!ct) return {error: 'unauthorized'}

    let comment = await db.comment.findUnique({
        where: {
            id: comment_id
        },
        select: {
            creator: {
                select: {
                    id: true,
                    temp_token: true
                }
            }
        }
    })

    if(comment.creator.id === user_id && comment.creator.temp_token === token) {
        // await db.incident.update({
        //     where: {
        //         id: incident
        //     }, 
        //     data: {
        //         comments: {
        //             disconnect: {
        //                 id: comment.id
        //             }
        //         }
        //     }
        // })

        return await db.comment.delete({
            where:{
                id: comment_id
            }
        })
    } else {
        return {error: 'unauthorized'}
    }
}

export async function checkToken(user_id, token) {
    let user = await db.user.findUnique({
        where:{
            id:user_id
        }, 
        select: {
            temp_token: true
        }
    })

    if(user.temp_token === token) {
        return true
    } else {
        return false
    }
}