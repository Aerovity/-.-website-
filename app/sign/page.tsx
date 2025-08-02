"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to auth page with register mode
    router.replace("/auth?mode=register")
  }, [router])

  return null
}
