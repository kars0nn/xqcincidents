// TODO ADD INCIDENT COUNTER WITH LASTEST INCIDENT BELOW AND A LINK TO AN ABOUT PAGE AND ALL INCIDENTS

import { Link, Form, Outlet } from '@remix-run/react'
import {GoCommentDiscussion} from 'react-icons/go'

export default function I() {
  return (
    <>
      <div>
        {/* <div className='p-4 w-full md:w-1/2 lg:w-3/5 filter backdrop-blur-lg bg-white/5 md:rounded-lg bg-opacity-80 text-center border-red-600 border-r-4 border-l-4'>
          <span className='text-lg font-extrabold'>Every. Single. Incident.</span>
        </div> */}
        <Outlet />
      </div>
    </>
  );
}
