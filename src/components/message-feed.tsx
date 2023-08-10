"use client";

import { useEffect } from "react";

import useMessages from "@/hooks/useMessages";
import { Message } from "./message";
import { useInView } from "react-intersection-observer";
import { NewMessageForm } from "./new-message-form";
import { Message as IMessage } from "../../backend/resources/db";

interface Props {
  messages: IMessage[];
  websocketUrl: string;
}

export default function MessageFeed({
  messages: initialMessages,
  websocketUrl,
}: Props) {
  const { messages, send } = useMessages(websocketUrl, initialMessages);
  const [scrollRef, inView, entry] = useInView({
    trackVisibility: true,
    delay: 1000,
  });

  useEffect(() => {
    if (entry?.target) {
      entry.target.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages?.length, entry?.target]);

  if (!messages) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-white'>Fetching most recent chat messages.</p>
      </div>
    );
  }

  return (
    <>
      {!inView && messages?.length && (
        <div className='py-1.5 w-full px-3 z-10 text-xs fixed flex justify-center bottom-0 mb-[120px] inset-x-0'>
          <button
            className='py-1.5 px-3 text-xs bg-primary border border-primary/30 rounded-full text-white font-medium'
            onClick={() => {
              entry?.target.scrollIntoView({
                behavior: "smooth",
                block: "end",
              });
            }}
          >
            Scroll to see latest messages
          </button>
        </div>
      )}
      <ul role='list' className='space-y-6'>
        {messages.map((message, idx) => (
          <li key={idx} className='relative flex gap-x-4'>
            <Message
              message={message}
              key={idx}
              isLast={idx === messages.length - 1}
            />
          </li>
        ))}
      </ul>
      <div ref={scrollRef} />
      {/* New message form */}
      <NewMessageForm send={send} />
    </>
  );
}
