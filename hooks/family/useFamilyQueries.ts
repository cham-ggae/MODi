import { useQuery } from '@tanstack/react-query'
import { familyApi } from '@/lib/api/family'
import {FamilyDashboardResponse} from "@/types/family.type";

/**
 * 내 가족 정보 조회 훅
 */
export const useFamilyData = () => {
    return useQuery({
        queryKey: ['family', 'my-family'],
        queryFn: familyApi.getMyFamily,
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)
        retry: (failureCount, error: any) => {
            // 204(가족 없음), 403(권한 없음), 404(없음)는 재시도하지 않음
            const noRetryStatuses = [204, 403, 404]
            if (noRetryStatuses.includes(error.response?.status)) {
                return false
            }
            return failureCount < 3
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
}

/**
 * 특정 가족 대시보드 조회 훅
 */
export const useFamilyDashboard = (fid?: number) => {
    return useQuery({
        queryKey: ['family', 'dashboard', fid],
        queryFn: () => familyApi.getFamilyDashboard(fid!),
        enabled: !!fid,
        staleTime: 2 * 60 * 1000, // 2분
        gcTime: 5 * 60 * 1000,
    })
}

/**
 * 초대 코드 검증 훅
 */
export const useValidateInviteCode = (inviteCode: string) => {
    return useQuery({
        queryKey: ['family', 'validate-invite', inviteCode],
        queryFn: () => familyApi.validateInviteCode(inviteCode),
        enabled: !!inviteCode && inviteCode.length === 6, // 6자리일 때만 검증
        retry: false, // 초대 코드 검증은 재시도하지 않음
        staleTime: 30 * 1000, // 30초
    })
}
