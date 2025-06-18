'use client'

import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/')
        }
    }, [isAuthenticated, router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">로그인</h2>
                    <p className="mt-2 text-gray-600">카카오 계정으로 로그인하세요</p>
                </div>

                <button
                    onClick={login}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                    카카오로 로그인
                </button>

            </div>
        </div>
    )
}
