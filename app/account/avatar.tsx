'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null
  url: string | null
  size: number
  onUpload: (url: string) => void
}) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }
    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
      if (uploadError) {
        throw uploadError
      }
      onUpload(filePath)
    } catch (error) {
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {avatarUrl ? (
        <div className="relative">
          <Image
            width={size}
            height={size}
            src={avatarUrl}
            alt="Avatar"
            className="rounded-full object-cover border-2 border-gray-600"
            style={{ height: size, width: size }}
          />
        </div>
      ) : (
        <div 
          className="rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center"
          style={{ height: size, width: size }}
        >
          <span className="text-gray-400 text-lg">?</span>
        </div>
      )}
      
      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 hover:border-gray-600"
          disabled={uploading}
          asChild
        >
          <label htmlFor="single">
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Avatar'}
          </label>
        </Button>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
} 