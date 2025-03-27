import Link from 'next/link'

export default function Navbar({ darkMode, toggleDarkMode }) {
  const menuItems = [
    { 
      name: 'News', 
      href: '/news', 
      icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' 
    }
  ]

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg rounded-2xl transition-colors duration-200">
          <nav className="border-b border-gray-100/20 dark:border-gray-700/20">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between h-16 px-4">
                <div className="flex items-center">
                  <Link 
                    href="/" 
                    className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
                  >
                    Car Studio
                  </Link>
                </div>

                {/* Main Navigation - Desktop */}
                <div className="hidden md:flex items-center space-x-6">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="relative text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 py-3 group flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                      <span className="whitespace-nowrap">{item.name}</span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-600 to-red-800 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                    </Link>
                  ))}
                </div>
                
                {/* Right Side Icons */}
                <div className="flex items-center space-x-4">
                  <button className="group p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={toggleDarkMode}
                    className="group p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                  >
                    {darkMode ? (
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                  <Link 
                    href="/login"
                    className="group p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden border-t border-gray-100 dark:border-gray-700">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-end h-12 px-4">
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 