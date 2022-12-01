import { sessionStorage } from '~/services/session.server'

export let loader = async ({ request }) => {
    let session = await sessionStorage.getSession(request.headers.get('cookie'))
    console.log(session.data)

    return null
}

export default function OhNo() {
    return (
        <h1 className="text-3xl font-bold bg-red-600 text-white p-10">
            xQc incidents is in early beta, which means you must be whitelisted to make an account. Come back soon when we are out of early beta!
        </h1>
    );
}
