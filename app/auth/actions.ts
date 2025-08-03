'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Input validation function
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

function validatePassword(password: string): boolean {
  return password.length >= 6 && password.length <= 128
}

function validateName(name: string): boolean {
  return name.length >= 1 && name.length <= 100 && /^[a-zA-Z\s'-]+$/.test(name)
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate inputs
  if (!email || !password) {
    redirect('/auth?error=Email and password are required')
  }

  if (!validateEmail(email)) {
    redirect('/auth?error=Invalid email format')
  }

  if (!validatePassword(password)) {
    redirect('/auth?error=Invalid password')
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    redirect('/auth?error=Invalid credentials')
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  // Validate inputs
  if (!email || !password || !name) {
    redirect('/auth?error=All fields are required')
  }

  if (!validateEmail(email)) {
    redirect('/auth?error=Invalid email format')
  }

  if (!validatePassword(password)) {
    redirect('/auth?error=Password must be at least 6 characters long')
  }

  if (!validateName(name)) {
    redirect('/auth?error=Invalid name format')
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  })
  if (error) {
    redirect('/auth?error=Signup failed')
  }
  revalidatePath('/', 'layout')
  redirect('/auth?message=Check your email to confirm your account')
} 