import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function WelcomeActionButtons() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="flex flex-col gap-3 mt-4"
    >
      <Button
        className="w-full bg-emerald-100 text-green-700 hover:bg-emerald-200"
        onClick={() => router.push("/survey")}
      >
        통신 성향 검사하기
      </Button>
      <Button
        className="w-full bg-emerald-100 text-green-700 hover:bg-emerald-200"
        onClick={() => router.push("/family-space")}
      >
        가족 스페이스로 이동
      </Button>
    </motion.div>
  );
}
