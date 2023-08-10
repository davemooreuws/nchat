import MessageFeed from "@/components/message-feed";
import { SignIn, SignedIn, SignedOut, auth } from "@clerk/nextjs";

const fetcher = (path: string, token: string, opts?: RequestInit) =>
  fetch(`${process.env.NEXT_PUBLIC_NITRIC_API_BASE_URL}/${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const retrieveData = async () => {
  try {
    const { getToken } = auth();

    const token = await getToken();
    const websocketUrl = await fetcher("/ws-address", token).then((res) =>
      res.text()
    );

    const initialMessages = await fetcher("/messages", token, {
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json());

    return {
      initialMessages,
      websocketUrl,
    };
  } catch (e) {
    return {
      initialMessages: undefined,
      websocketUrl: undefined,
    };
  }
};

export default async function Home() {
  const { initialMessages, websocketUrl } = await retrieveData();

  return (
    <div className='flex flex-col bg-cover'>
      <SignedIn>
        {!websocketUrl ? (
          <div className='max-w-4xl mx-auto p-6'>
            There was a problem loading the messages, please login again.
          </div>
        ) : (
          <div className='flex-1 overflow-y-scroll no-scrollbar p-6'>
            <div className='max-w-4xl mx-auto'>
              <MessageFeed
                messages={initialMessages}
                websocketUrl={websocketUrl}
              />
            </div>
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <div className='h-full flex items-center justify-center flex-col py-10'>
          <SignIn />
        </div>
      </SignedOut>
    </div>
  );
}
