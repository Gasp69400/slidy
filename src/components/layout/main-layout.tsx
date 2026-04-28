'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  Building,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Propriétés', href: '/properties', icon: Building },
  { name: 'Paramètres', href: '/settings', icon: Settings },
  { name: 'Abonnement', href: '/billing', icon: CreditCard },
]

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const [displayName, setDisplayName] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    void supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      if (!u) {
        setDisplayName(null)
        return
      }
      const meta = u.user_metadata as { name?: string; full_name?: string } | undefined
      const name =
        (typeof meta?.name === 'string' && meta.name) ||
        (typeof meta?.full_name === 'string' && meta.full_name) ||
        u.email?.split('@')[0] ||
        'Utilisateur'
      setDisplayName(name)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user
      if (!u) {
        setDisplayName(null)
        return
      }
      const meta = u.user_metadata as { name?: string; full_name?: string } | undefined
      setDisplayName(
        (typeof meta?.name === 'string' && meta.name) ||
          (typeof meta?.full_name === 'string' && meta.full_name) ||
          u.email?.split('@')[0] ||
          'Utilisateur',
      )
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold text-gray-900">Immobilier SaaS</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    isActive
                      ? 'border-r-2 border-blue-700 bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-shrink-0 items-center border-b border-gray-200 px-4 py-6">
            <h1 className="text-xl font-bold text-gray-900">Immobilier SaaS</h1>
          </div>
          <nav className="mt-8 flex-1 space-y-1 px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Immobilier SaaS</h1>
            <div className="w-8" />
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="flex items-center justify-end border-b border-gray-200 bg-white px-6 py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {displayName ? displayName.charAt(0) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{displayName || 'Utilisateur'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void handleSignOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
