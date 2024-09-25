'use client';

import Link from 'next/link';
import { SearchComponent } from '@/components/SearchComponent';

const Header = () => {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold sm:inline-block">Jackson產業觀點</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <SearchComponent />
          <Link
            href="https://linktr.ee/jacksontseng"
            className="text-sm font-medium"
            target="_blank"
          >
            關於我
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
