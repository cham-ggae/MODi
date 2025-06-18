"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"

interface PlanItem {
  id: string
  name: string
  description: string
  originalPrice?: number
  discountedPrice?: number
}

interface PlanSharingSectionProps {
  plans?: PlanItem[]
}

export function PlanSharingSection({ plans }: PlanSharingSectionProps) {
  const { isDarkMode } = useTheme()

  const defaultPlans: PlanItem[] = [
    {
      id: "1",
      name: "5G 시그니처 가족결합",
      description: "월 89,000원 → 67,000원",
    },
    {
      id: "2",
      name: "참쉬운 가족결합",
      description: "휴대폰 + 인터넷 결합할인",
    },
  ]

  const displayPlans = plans || defaultPlans

  return (
    <Card className={`border border-[#81C784] ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <CardHeader>
        <CardTitle className="text-[#388E3C]">요금제 공유 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {displayPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`p-4 border border-[#81C784] rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-[#F1F8E9]"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h4 className="font-medium mb-2 text-[#388E3C]">{plan.name}</h4>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} opacity-70 mb-3`}>
                {plan.description}
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-[#81C784] text-[#388E3C] ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-white"}`}
                >
                  자세히 보기
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
