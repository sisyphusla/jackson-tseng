import Link from 'next/link'

const Header = () => {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Jackson產業觀點
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">

            <Link
              href="/contact"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              聯繫
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* 這裡可以添加搜索框或其他元素 */}
          </div>
          <nav className="flex items-center">

          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header