import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NChat",
  description: "Created by David Moore",
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
