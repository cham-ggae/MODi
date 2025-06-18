// src/hooks/family/useFamilyMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { familyApi } from '@/lib/api/family'
import { toast } from 'sonner' // 또는 사용 중인 toast 라이브러리

/**
 * 가족 생성 뮤테이션
 */
export const useCreateFamily = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: familyApi.createFamily,
        onSuccess: (data) => {
            // 가족 관련 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ['family'] })

            if (data.success) {
                toast.success(data.message || '가족 스페이스가 생성되었습니다!')
            } else {
                toast.error(data.message || '가족 생성에 실패했습니다.')
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || '가족 생성 중 오류가 발생했습니다.'
            toast.error(message)
            console.error('가족 생성 에러:', error)
        }
    })
}

/**
 * 가족 참여 뮤테이션
 */
export const useJoinFamily = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: familyApi.joinFamily,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['family'] })

            if (data.success) {
                toast.success(data.message || '가족에 성공적으로 참여했습니다!')
            } else {
                toast.error(data.message || '가족 참여에 실패했습니다.')
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || '가족 참여 중 오류가 발생했습니다.'
            toast.error(message)
            console.error('가족 참여 에러:', error)
        }
    })
}

/**
 * 새 초대 코드 생성 뮤테이션
 */
export const useGenerateInviteCode = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: familyApi.generateNewInviteCode,
        onSuccess: (newCode, fid) => {
            // 해당 가족의 데이터 무효화
            queryClient.invalidateQueries({ queryKey: ['family', 'dashboard', fid] })
            queryClient.invalidateQueries({ queryKey: ['family', 'my-family'] })

            toast.success('새로운 초대 코드가 생성되었습니다!')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || '초대 코드 생성에 실패했습니다.'
            toast.error(message)
        }
    })
}

/**
 * 가족 탈퇴 뮤테이션
 */
export const useLeaveFamily = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: familyApi.leaveFamily,
        onSuccess: () => {
            // 모든 가족 관련 데이터 무효화
            queryClient.invalidateQueries({ queryKey: ['family'] })
            toast.success('가족에서 나왔습니다.')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || '가족 탈퇴에 실패했습니다.'
            toast.error(message)
        }
    })
}
