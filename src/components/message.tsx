import { formatRelative, formatDistance, differenceInHours } from "date-fns";
import Image from "next/image";
import { Message as IMessage } from "../../backend/resources/db";
import { cn } from "@/utils/cn";

interface Props {
  message: IMessage;
  isLast: boolean;
}

export const Message = ({ message, isLast }: Props) => {
  return (
    <>
      <div
        className={cn(
          isLast ? "h-6" : "-bottom-6",
          "absolute left-0 top-0 flex w-6 justify-center"
        )}
      >
        <div className='w-px bg-gray-200' />
      </div>
      <a
        href={`https://github.com/${message.username}`}
        target='_blank'
        rel='noopener noreferrer'
        className='relative mt-3 h-6 w-6 flex-none bg-gray-50'
      >
        <Image
          width={24}
          height={24}
          className='rounded-full'
          src={message.avatar}
          alt={message.username}
          title={message.username}
        />
      </a>
      <div className='flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200'>
        <div className='flex justify-between gap-x-4'>
          <div className='py-0.5 text-xs leading-5 text-gray-500'>
            <span className='font-medium text-gray-900'>
              {message.username}
            </span>{" "}
            messaged
          </div>
          {message.createdAt && (
            <time
              dateTime={message.createdAt.toString()}
              className='flex-none py-0.5 text-xs leading-5 text-gray-500'
            >
              {differenceInHours(new Date(), new Date(message.createdAt)) >= 1
                ? formatRelative(new Date(message.createdAt), new Date())
                : formatDistance(new Date(message.createdAt), new Date(), {
                    addSuffix: true,
                  })}
            </time>
          )}
        </div>
        <p className='text-sm leading-6 text-gray-500'>
          {typeof message.body === "string" ? message.body : null}
        </p>
      </div>
    </>
  );
};
