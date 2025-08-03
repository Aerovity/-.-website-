'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Avatar from './avatar'
import SpotlightButton from '@/components/spotlight-button'

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading user data!' })
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating the data!' })
      // Clear error message after 5 seconds
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-white hover:bg-gray-800/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </header>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
          <Card className="w-full max-w-2xl bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Account Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-lg border ${
                  message.type === 'success' 
                    ? 'bg-green-900/20 border-green-700 text-green-200' 
                    : 'bg-red-900/20 border-red-700 text-red-200'
                } flex items-center space-x-2`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              )}

              {/* Avatar Section */}
              <div className="flex justify-center">
                <Avatar
                  uid={user?.id ?? null}
                  url={avatar_url}
                  size={120}
                  onUpload={(url) => {
                    setAvatarUrl(url)
                    updateProfile({ fullname, username, website, avatar_url: url })
                  }}
                />
              </div>

              <Separator className="bg-gray-700" />

                             <div className="space-y-3">
                 <Label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center">
                   <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                   Email Address
                 </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="text"
                    value={user?.email}
                    disabled
                    className="h-12 bg-gray-800/30 border-gray-600/50 text-gray-400 rounded-lg transition-all duration-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 backdrop-blur-sm"
                  />
                                     <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                     <div className="w-2 h-2 bg-white rounded-full"></div>
                   </div>
                </div>
              </div>

              <Separator className="bg-gray-700/50" />

                             <div className="space-y-3">
                 <Label htmlFor="fullName" className="text-sm font-medium text-gray-300 flex items-center">
                   <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                   Full Name
                 </Label>
                <div className="relative group">
                  <Input
                    id="fullName"
                    type="text"
                    value={fullname || ''}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 bg-gray-800/30 border-gray-600/50 text-white placeholder:text-gray-500 rounded-lg transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 group-hover:border-gray-500 backdrop-blur-sm"
                  />
                                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-2 h-2 bg-white rounded-full"></div>
                   </div>
                </div>
              </div>

                             <div className="space-y-3">
                 <Label htmlFor="username" className="text-sm font-medium text-gray-300 flex items-center">
                   <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                   Username
                 </Label>
                <div className="relative group">
                  <Input
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a unique username"
                    className="h-12 bg-gray-800/30 border-gray-600/50 text-white placeholder:text-gray-500 rounded-lg transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 group-hover:border-gray-500 backdrop-blur-sm"
                  />
                                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-2 h-2 bg-white rounded-full"></div>
                   </div>
                </div>
              </div>

                             <div className="space-y-3">
                 <Label htmlFor="website" className="text-sm font-medium text-gray-300 flex items-center">
                   <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                   Website
                 </Label>
                <div className="relative group">
                  <Input
                    id="website"
                    type="url"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://your-website.com"
                    className="h-12 bg-gray-800/30 border-gray-600/50 text-white placeholder:text-gray-500 rounded-lg transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 group-hover:border-gray-500 backdrop-blur-sm"
                  />
                                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-2 h-2 bg-white rounded-full"></div>
                   </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <Separator className="bg-gray-700/50" />

              <div className="flex gap-4">
                <div className="flex-1">
                  <SpotlightButton
                    onClick={() => updateProfile({ fullname, username, website, avatar_url })}
                    className="w-full h-12"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </div>
                    ) : (
                      'Update Profile'
                    )}
                  </SpotlightButton>
                </div>

                <form action="/auth/signout" method="post" className="flex-1">
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full h-12 bg-gray-800/30 border-gray-600/50 text-white hover:bg-gray-700/50 hover:border-gray-500 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    Sign out
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 