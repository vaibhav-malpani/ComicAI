import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, Image, Zap, Palette, Sparkles } from 'lucide-react'
import clsx from 'clsx'

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home, color: 'from-blue-400 to-blue-600' },
    { path: '/create', label: 'Create', icon: Plus, color: 'from-green-400 to-green-600' },
    { path: '/gallery', label: 'Gallery', icon: Image, color: 'from-purple-400 to-purple-600' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-xl border-b-4 border-gradient-to-r from-comic-blue to-comic-purple">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                <Zap className="text-white" size={28} />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-comic-yellow rounded-full border-2 border-black flex items-center justify-center animate-pulse">
                <Sparkles size={12} className="text-black" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                ComicCraft
              </span>
              <span className="text-xs text-gray-500 font-medium">AI Comic Generator</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {navItems.map(({ path, label, icon: Icon, color }) => (
              <Link
                key={path}
                to={path}
                className={clsx(
                  'relative flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform group',
                  location.pathname === path
                    ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105`
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:scale-105'
                )}
              >
                <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                <span className="hidden sm:inline">{label}</span>

                {/* Active Indicator */}
                {location.pathname === path && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}

            {/* Action Button */}
            <Link 
              to="/create" 
              className="ml-4 btn-comic wiggle-element hidden md:flex"
            >
              <Palette size={18} />
              <span className="ml-2 font-comic">Create Now!</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Border Animation */}
      <div className="h-1 bg-gradient-to-r from-comic-blue via-comic-purple to-comic-red animate-pulse"></div>
    </nav>
  )
}

export default Navbar
