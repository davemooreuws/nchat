import { useUser } from "@clerk/nextjs";
import { Popover, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import useSound from "use-sound";
import { FaceSmileIcon } from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

export const NewMessageForm = ({ send }) => {
  const { user } = useUser();
  const textAreaRef = useRef();
  const [play] = useSound("sent.wav");
  const [body, setBody] = useState("");

  const githubAcc = user?.externalAccounts.find(
    (acc) => acc.provider === "github"
  );

  return (
    <div className='mt-6 flex gap-x-3'>
      <img
        src={githubAcc?.imageUrl}
        alt={githubAcc?.username}
        className='h-6 w-6 flex-none rounded-full bg-gray-50'
      />
      <form
        className='relative flex-auto'
        onSubmit={async (e) => {
          e.preventDefault();

          if (body) {
            send({
              body,
              username: githubAcc.username,
              avatar: githubAcc.imageUrl,
            });

            setBody("");

            play();
          }
        }}
      >
        <div className='overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
          <label htmlFor='message' className='sr-only'>
            Add your message
          </label>
          <textarea
            ref={textAreaRef}
            rows={2}
            autoFocus
            name='message'
            id='message'
            className='block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
            placeholder='Add your message...'
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div className='absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
          <div className='flex items-center'>
            <Popover className='relative'>
              {({ open, close }) => (
                <>
                  <Popover.Button
                    className={`
                ${open ? "" : "text-opacity-90"}
                rounded-md bg-white disabled:cursor-not-allowed disabled:opacity-50 px-2.5 py-1.5 text-sm font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                `}
                  >
                    <span>
                      <FaceSmileIcon
                        className='h-5 w-5 flex-shrink-0'
                        aria-hidden='true'
                      />
                      <span className='sr-only'>Add your mood</span>
                    </span>
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-200'
                    enterFrom='opacity-0 translate-y-1'
                    enterTo='opacity-100 translate-y-0'
                    leave='transition ease-in duration-150'
                    leaveFrom='opacity-100 translate-y-0'
                    leaveTo='opacity-0 translate-y-1'
                  >
                    <Popover.Panel className='absolute -top-[475px] right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      <EmojiPicker
                        onEmojiClick={(data) => {
                          setBody((prev) => prev + data.emoji + " ");
                          close(textAreaRef.current);
                        }}
                      />
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
          <button
            type='submit'
            disabled={!body || !user}
            className='rounded-md bg-white disabled:cursor-not-allowed disabled:opacity-50 px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          >
            Message
          </button>
        </div>
      </form>
    </div>
  );
};
