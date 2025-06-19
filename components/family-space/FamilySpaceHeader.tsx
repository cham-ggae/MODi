import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function FamilySpaceHeader() {
  return (
    <div className="flex items-center justify-between p-4 flex-shrink-0">
      <Link href="/chat">
        <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </Link>
      <ThemeToggle />
    </div>
  );
}
