import useSWRSubscription from "swr/subscription";
import { Message } from "../../backend/resources/db";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";

const useMessages = (websocketUrl: string, initialMessages: Message[]) => {
  const socketRef = useRef<WebSocket>();
  const { getToken, isSignedIn } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [token, setToken] = useState<string | null>();

  useEffect(() => {
    if (isSignedIn) {
      (async () => {
        setToken(await getToken());
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
  };
};

export default useMessages;
