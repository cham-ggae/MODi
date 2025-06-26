import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { seniorPlans } from "@/lib/survey-result-data";
import { Users, Phone, Gift, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserInfo } from "@/types/user-info.type";

// fallback plan data (seniorPlans가 없을 경우 사용)
const fallbackPlan = {
  name: "시니어 LTE 베이직",
  description: "통화 무제한, 데이터 1GB, 시니어 할인 20% 적용",
  price: "15,000원",
  features: ["통화 무제한", "데이터 1GB", "시니어 할인 20%"],
};

interface SeniorPlanModalProps {
  userInfo: UserInfo | null;
}

export default function SeniorPlanModal({ userInfo }: SeniorPlanModalProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("SeniorPlanModal - userInfo:", userInfo);

    if (!userInfo) {
      console.log("SeniorPlanModal - No userInfo");
      return;
    }

    console.log("SeniorPlanModal - userInfo.age:", userInfo.age);
    console.log("SeniorPlanModal - userInfo.plan_id:", userInfo.plan_id);

    const isSenior = typeof userInfo.age === "string" && userInfo.age.startsWith("70");

    console.log("SeniorPlanModal - isSenior:", isSenior);

    if (isSenior) {
      // 추천 상태 확인
      const recommendedMembers = JSON.parse(localStorage.getItem("recommendedMembers") || "[]");
      const hasBeenRecommended = recommendedMembers.includes(userInfo.uid);

      console.log("SeniorPlanModal - hasBeenRecommended:", hasBeenRecommended);
      console.log("SeniorPlanModal - userInfo.uid:", userInfo.uid);
      console.log("SeniorPlanModal - recommendedMembers:", recommendedMembers);

      // 추천을 받은 경우에만 모달 표시
      if (hasBeenRecommended) {
        console.log("SeniorPlanModal - Setting showModal to true");
        setShowModal(true);
      }
    }
  }, [userInfo]);

  console.log("SeniorPlanModal - showModal:", showModal);

  if (!showModal) return null;

  // seniorPlans가 존재하는지 확인하고, plan_id에 해당하는 요금제 찾기
  let plan = null;

  try {
    // seniorPlans가 undefined인지 확인
    if (!seniorPlans) {
      console.error("seniorPlans is undefined!");
      plan = fallbackPlan;
    } else if (typeof seniorPlans === "object" && seniorPlans.plans) {
      // seniorPlans.plans 배열에서 첫 번째 요금제 사용
      const firstPlan = seniorPlans.plans[0];
      if (firstPlan) {
        plan = {
          name: firstPlan.name,
          description: firstPlan.description,
          price: `${firstPlan.price.toLocaleString()}원`,
          features: firstPlan.features,
        };
      }
    }
  } catch (error) {
    console.error("Error accessing seniorPlans:", error);
    plan = fallbackPlan;
  }

  if (!plan) {
    console.log("SeniorPlanModal - No plan found, using fallback");
    plan = fallbackPlan;
  }

  const handleChatClick = () => {
    setShowModal(false);
  };

  const handleFamilySpaceClick = () => {
    setShowModal(false);
    router.push("/family-space");
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-md mx-auto p-0 bg-white rounded-2xl">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-bold text-center text-gray-900">
            아들님이 이런 요금제 추천했어요!
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* 설명 */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="text-[30px] font-bold text-center text-gray-700 leading-relaxed">
              <div className="mb-2">
                하루에 아드님과 통화 5번, <br />
                문자 10통 보낼 수 있어요!
              </div>
            </div>
          </div>

          {/* 요금제 카드 */}
          <Card className="border-2 border-blue-200 bg-blue-50 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Gift className="w-5 h-5 mr-2 text-blue-600" />
                {plan.name}
              </CardTitle>
              <div className="text-2xl font-bold text-blue-600">{plan.price}</div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-sm text-gray-700">{plan.description}</p>
                <div className="space-y-2">
                  {plan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 메시지 */}
          {/* <div className="text-center text-sm text-gray-600 mb-6">
            시니어를 위한 특별한 요금제로 더 편리하게 사용해보세요! 👴👵
          </div> */}

          {/* 버튼들 */}
          <div className="space-y-3">
            <Button
              onClick={handleFamilySpaceClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              가족스페이스 이동하기
            </Button>
            <Button
              onClick={handleChatClick}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-4 text-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              챗봇 계속하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
