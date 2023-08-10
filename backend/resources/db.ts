import { collection } from "@nitric/sdk";

export interface Message {
  username: string;
  avatar: string;
  body: string;
  likes: number;
  dislikes: number;
  createdAt: number;
}

export interface Connection {
  connectionId: string;
  userId: string;
}

export const messagesdb = collection<Message>("db").for(
  "reading",
  "writing",
  "deleting"
);

export const connectionsdb = collection<Connection>("connections").for(
  "reading",
  "writing",
  "deleting"
);
