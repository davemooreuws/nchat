import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/header";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

const title = "NChat";
const description = "Realtime chat using Websockets, Next.js, Nitric and Clerk";
const url = "https://nchat.nitric.rocks";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url,
  },
  metadataBase: new URL(url),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "rgb(44, 64, 247)",
        },
        layout: {
          logoImageUrl: "/nitric-logo.svg",
        },
      }}
    >
      <html lang='en'>
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
