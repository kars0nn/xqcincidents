import { Disclosure } from '@headlessui/react'

export default function About() {
  return (
    <div className="w-full px-4 pt-16">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-black/70 p-10">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-white/80 px-4 py-2 text-left text-md font-bold text-black hover:bg-white/90">
                <span>What account data is taken from twitch when I sign up?</span>
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-neutral-100 text-lg font-bold">
                Any data we store, is already publicly accessible. We only collect your display name, twitch id, profile photo, and your bio (for future profiles maybe?) If you have questions, ask karson.
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <br />
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-white/80 px-4 py-2 text-left text-md font-bold text-black hover:bg-white/90">
                <span>What badges do I get?</span>
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-neutral-100 text-lg font-bold">
                Any 7tv badge you have, will appear here. Still working on twitch sub badges.
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}