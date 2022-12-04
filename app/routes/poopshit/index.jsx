// TODO ADD INCIDENT COUNTER WITH LASTEST INCIDENT BELOW AND A LINK TO AN ABOUT PAGE AND ALL INCIDENTS

import { Link, Form, Outlet } from '@remix-run/react'
import { GoCommentDiscussion } from 'react-icons/go'

export default function Index() {
  return (
    <>
      <br />
      <div className='bg-black/20 p-4 rounded-xl font-mono'>
        {/* <div className='p-4 w-full md:w-1/2 lg:w-3/5 filter backdrop-blur-lg bg-white/5 md:rounded-lg bg-opacity-80 text-center border-red-600 border-r-4 border-l-4'>
          <span className='text-lg font-extrabold'>Every. Single. Incident.</span>
        </div> */}
        to review -
        <h1 className='font-extrabold text-xl'>
          Pick an incident from the list to review it.
        </h1>
        <hr />
        <br />
        <span>Create a badge:</span>
        <Form>
          <input type="text" name="badge_name" className='bg-black p-2 my-2' placeholder='Name' />
          <br />
          <input type="text" name="badge_url" className='bg-black p-2 my-2' placeholder='URL' />
          <br />
          <select name='rarity' className='bg-black p-2'>
            <option disabled selected>Rarity</option>
            <option value="COMMON">Common</option>
            <option value="HARD_TO_GET">Hard to get</option>
            <option value="RARE">Rare</option>
            <option value="ULTRA_RARE">ULTRA Rare</option>
            <option value="IMPOSSIBLE">IMPOSSIBLE</option>
          </select>
          <button name='_action' value="_delinc" className="text-green-400 font-extrabold ml-3 mt-2">CREATE</button>
        </Form>
        <br />
        <hr />
        <br />
        <span>Ban A User:</span>
        <Form>
          <input type="text" name="user_id" className='bg-black p-2' placeholder='User ID' />
          <button name='_action' value="_banuser" className="text-red-400 font-extrabold ml-3">BAN</button>
        </Form>
        <br />
        <hr />
        <br />
        <span>Delete an Incident:</span>
        <Form>
          <input type="text" name="inc_id" className='bg-black p-2' placeholder='Incident ID' />
          <button name='_action' value="_delinc" className="text-red-400 font-extrabold ml-3">DELETE</button>
        </Form>
        <br />
        <hr />
        <br />
      </div>
    </>
  );
}
