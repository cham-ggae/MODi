import { ErrorResponse } from "@/types/plants.type";
import { AxiosError } from "axios";

// plants 에러 방식 처리를 위한 핸들러 작성(전역 처리 따로 얘기 한게 없길랭)
export const handleplantApiError = (error: unknown): string => {
  const axiosError = error as AxiosError<ErrorResponse>;
  return axiosError?.response?.data?.message ?? "새싹 기능 중 오류가 발생했습니다.";
};
