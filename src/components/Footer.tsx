import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="supports-backdrop-blur:bg-background/60 bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-center">
        <Link
          href="https://linktr.ee/jacksontseng"
          className="flex items-center space-x-2"
          target="_blank"
        >
          <span className="font-bold">
            報價並非的即時報價，所提供資訊均僅供參考，不宜做為買賣依據之用。
          </span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
