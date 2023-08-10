import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export function Header() {
  return (
    <header className='p-6 bg-white/5 border-b border-[#121118]'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center'>
          <p className='inline-flex items-center space-x-3'>
            <a
              href='https://nitric.io?ref=nchat'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                src={"/nchat-logo.svg"}
                width={150}
                height={58}
                alt='Nitric Logo'
              />
            </a>
            <span className='text-white font-bold text-xl'>NChat</span>
          </p>
          <SignedIn>
            <div className='flex space-x-1'>
              <UserButton afterSignOutUrl='/' />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
