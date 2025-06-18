import { authenticatedApiClient } from './axios'
import type {
    FamilySpace,
    FamilyDashboardResponse,
    CreateFamilyRequest,
    CreateFamilyResponse,
    InviteCodeValidationResponse,
    JoinFamilyRequest
} from '@/types/family.type'

export const familyApi = {
    /**
     * 내 가족 정보 조회
     * GET /family
     */
    getMyFamily: async (): Promise<FamilyDashboardResponse | null> => {
        try {
            const response = await authenticatedApiClient.get('/family')
            return response.data
        } catch (error: any) {
            // 204 No Content: 가족에 속해있지 않음
            if (error.response?.status === 204) {
                return null
            }
            console.error('내 가족 정보 조회 실패:', error)
            throw error
        }
    },

    /**
     * 가족 대시보드 조회
     * GET /family/{fid}
     */
    getFamilyDashboard: async (fid: number): Promise<FamilyDashboardResponse> => {
        try {
            const response = await authenticatedApiClient.get(`/family/${fid}`)
            return response.data
        } catch (error) {
            console.error('가족 대시보드 조회 실패:', error)
            throw error
        }
    },

    /**
     * 가족 스페이스 생성
     * POST /family
     */
    createFamily: async (data: CreateFamilyRequest): Promise<CreateFamilyResponse> => {
        try {
            const response = await authenticatedApiClient.post('/family', data)
            return response.data
        } catch (error) {
            console.error('가족 스페이스 생성 실패:', error)
            throw error
        }
    },

    /**
     * 가족 스페이스 참여 (초대 코드)
     * POST /family/join
     */
    joinFamily: async (inviteCode: string): Promise<CreateFamilyResponse> => {
        try {
            const joinData: JoinFamilyRequest = { inviteCode }
            const response = await authenticatedApiClient.post('/family/join', joinData)
            return response.data
        } catch (error) {
            console.error('가족 스페이스 참여 실패:', error)
            throw error
        }
    },

    /**
     * 초대 코드 검증
     * GET /family/invite/{inviteCode}
     */
    validateInviteCode: async (inviteCode: string): Promise<InviteCodeValidationResponse> => {
        try {
            const response = await authenticatedApiClient.get(`/family/invite/${inviteCode}`)
            return response.data
        } catch (error) {
            console.error('초대 코드 검증 실패:', error)
            throw error
        }
    },

    /**
     * 새 초대 코드 생성
     * POST /family/{fid}
     */
    generateNewInviteCode: async (fid: number): Promise<string> => {
        try {
            const response = await authenticatedApiClient.post(`/family/${fid}`)
            return response.data // 새로운 초대 코드 문자열
        } catch (error) {
            console.error('새 초대 코드 생성 실패:', error)
            throw error
        }
    },

    /**
     * 가족 탈퇴
     * DELETE /family/{fid}/leave
     */
    leaveFamily: async (fid: number): Promise<void> => {
        try {
            await authenticatedApiClient.delete(`/family/${fid}/leave`)
        } catch (error) {
            console.error('가족 탈퇴 실패:', error)
            throw error
        }
    }
}
