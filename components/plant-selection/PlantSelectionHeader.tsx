import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PlantSelectionHeader() {
  return (
    <div className="flex items-center justify-between p-4">
      <Link href="/family-space">
        <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </Link>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">새싹 만들기</h1>
      <div className="w-6 h-6" />
    </div>
  );
}
