import useSWRSubscription from "swr/subscription";
import { Message } from "../../backend/resources/db";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetcher } from "@/utils/fetcher";

const useMessages = (websocketUrl: string) => {
  const socketRef = useRef<WebSocket>();
  const { getToken, isSignedIn } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [token, setToken] = useState<string | null>();

  useEffect(() => {
    if (isSignedIn) {
      (async () => {
        const token = await getToken();
        setToken(token);

        const initialMessages = await fetcher("/messages", token, {
          headers: {
            "content-type": "application/json",
          },
        }).then((res) => res.json());

        setMessages(initialMessages);
      })();
    }
  }, [isSignedIn]);

  useSWRSubscription<Message[]>(
    isSignedIn && token ? `${websocketUrl}?access_token=${token}` : null,
    (key: string, { next }: any) => {
      socketRef.current = new WebSocket(key);

      socketRef.current.addEventListener("message", (event) => {
        const data = JSON.parse(event.data) as Message;

        setMessages((prev = []) => [...prev, data]);

        next(null, data);
      });

      socketRef.current.addEventListener("open", () => {
        setLoaded(true);
      });

      socketRef.current.addEventListener("error", (event: any) =>
        next(event.error)
      );
      return () => socketRef.current?.close();
    }
  );

  const send = (data: Message) => {
    socketRef.current?.send(JSON.stringify(data));
  };

  return {
    messages,
    send,
    loaded,
  };
};

export default useMessages;
