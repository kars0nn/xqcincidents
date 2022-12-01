const {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useTransition,
  Form,
  useLoaderData
} = require("@remix-run/react");
import { useEffect } from "react";
import styles from "./styles/app.css"
import NProgress from "nprogress";
import nProgressStyles from "nprogress/nprogress.css";
import { Menu } from '@headlessui/react'
import { DropdownMenu } from "./components/menu";
import { findUserById } from '~/services/user.server';
import { authenticator, twitchStrategy } from '~/services/auth.server';
import { Footer } from "./components/Footer";
import { isUserLoggedInSafe } from "~/services/auth.server";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: nProgressStyles },
  ]
}

export const loader = async ({ request }) => {
  let user = await isUserLoggedInSafe(request)
  return { user };
};


// export const loader = async ({ request }) => {
//   let checkUser = await authenticator.isAuthenticated(request);
//   if(!checkUser) return {isLoggedIn:false};
//   const user = await findUserById(checkUser?.user_id)
//   if (user) {
//     return { isLoggedIn: true }
//   } else {
//     return { isLoggedIn: false }
//   }
// };

export const meta = () => ({
  charset: "utf-8",
  title: "xQc Incidents",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  let data = useLoaderData()
  let transition = useTransition();
  useEffect(() => {
    if (transition.state === "idle") NProgress.done();
    else NProgress.start();
    NProgress.configure({ showSpinner: false });
  }, [transition.state]);
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-neutral-900 text-white">
        <Navigation>
          <Outlet />
        </Navigation>
        <Footer user={data.user} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function Navigation({ children }) {
  let data = useLoaderData()
  // let check = data.isLoggedIn
  return (
    <>
      <div className="p-2 bg-black/20" >
        <Link to="/">
          <img src="https://cdn.7tv.app/emote/6249bf0a835f6c1e0ad979bb/4x.webp" className="w-12 inline mr-5" alt="fabulous_pshyco's xqcDespair emote on 7tv" title="fabulous_pshyco's xqcDespair emote on 7tv" />
          <span className="font-bold hover:underline" title="xQc incidents">xQc incidents</span>
          {/* <div className="float-right">
          <Link to="/i" className="hover:underline" title="incidents page">incidents</Link>
            <Form action={check ? '/logout' : '/auth/twitch'} method="post">
              <button className='bg-purple-500 p-2 rounded-lg text-white border-b-purple-900 border-b-2 '>{check ? 'Logout' : 'Login with Twitch'}</button>
            </Form>
          </div> */}
          {/* <DropdownMenu /> */}
        </Link>
      </div>
      <br />
      {children}
    </>
  )
}
