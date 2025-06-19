import {
  PlantStatus,
  CreatePlantRequest,
  RewardHistory,
  AddPointRequestDto,
  ActivityType,
} from "@/types/plants.type";
import { authenticatedApiClient } from "./axios";

// 1. 식물 생성 요청하기 (flower ,tree)
export const plantApi = {
  createplant: async (data: CreatePlantRequest): Promise<void> => {
    await authenticatedApiClient.post("/plants", data);
  },
  // 2. 식물 정보 가져오기 fid 전달해서
  getPlantStatus: async (fid: number): Promise<PlantStatus> => {
    const response = await authenticatedApiClient.get(`/plants/${fid}`);
    return response.data;
  },
  //3. 보상 수령: POST /plants/claim-reward -5단계가 되어서 iscomplited =true가 되면 랜덤으로 보상정보 DB에 저장/
  claimReward: async (): Promise<RewardHistory> => {
    const response = await authenticatedApiClient.post("/plants/claim-reward");
    return response.data;
  },
  //4. 보상 수령 이력 조회: GET /plants/rewards/history -보상을 받아옴 , 여러개의 식물을 키웠을 수 있으니 []
  getRewardHistory: async (): Promise<RewardHistory[]> => {
    const response = await authenticatedApiClient.get("/plants/rewards/history");
    return response.data;
  },
  //5.물주기 포인트 적립: POST /points/add - 각 활동 별 가중치
  addPoint: async (data: AddPointRequestDto): Promise<void> => {
    await authenticatedApiClient.post("/points/add", data);
  },
  //6. 오늘 물 준 사람들 조회: GET /watered-members/{fid} // 소켓 백업용
  getWaterMembers: async (fid: number): Promise<number[]> => {
    const response = await authenticatedApiClient.get(`/points/watered-members/${fid}`);
    return response.data;
  },
  // 7. 오늘 활동 수행 여부 확인
  checkTodayActivity: async (type: ActivityType): Promise<boolean> => {
    const response = await authenticatedApiClient.get(`/points/check-today/${type}`);
    return response.data;
  },
  //8. 영양제 조회 GET /nutrients/stock
  getNutrients: async (): Promise<number> => {
    const response = await authenticatedApiClient.get("/nutrients/stock");
    return response.data;
  },
};
