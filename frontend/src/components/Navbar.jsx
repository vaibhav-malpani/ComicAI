import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, Image } from 'lucide-react'
import clsx from 'clsx'

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/create', label: 'Create Comic', icon: Plus },
    { path: '/gallery', label: 'Gallery', icon: Image },
  ]

  return (
    <nav className="bg-white shadow-lg border-b-4 border-comic-blue">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-comic-blue to-comic-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">DC</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Daily Comics</span>
          </Link>

          <div className="flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={clsx(
                  'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                  location.pathname === path
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                )}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
