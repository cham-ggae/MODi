'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { withAuth } from '@/components/providers/AuthProvider';
import { submitAdditionalInfo, type AdditionalInfoRequest } from '@/lib/api/auth';
import { useAuth } from '@/hooks/useAuth';
import { PageLayout } from '@/components/layouts/page-layout';
import { Button } from '@/components/ui/button';

function BasicInfoPage() {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [age, setAge] = useState<AdditionalInfoRequest['age'] | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const handleGenderSelect = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
    setTimeout(() => setStep(2), 300);
  };

  const handleAgeSelect = (selectedAge: AdditionalInfoRequest['age']) => {
    setAge(selectedAge);
  };

  const handleSubmit = async () => {
    if (!gender || !age) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const additionalInfo: AdditionalInfoRequest = {
        gender,
        age,
      };

      await submitAdditionalInfo(additionalInfo);

      // 성공 시 채팅 페이지로 이동
      router.push('/chat');
    } catch (error) {
      console.error('추가 정보 제출 실패:', error);
      alert('추가 정보 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout variant="gradient" padding="none">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">기본 정보 입력</h1>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-12">
            성별을 선택해주세요
          </h1>

          <div className="space-y-4">
            <button
              onClick={() => handleGenderSelect('male')}
              className="w-full p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-3xl flex items-center space-x-4 hover:border-green-400 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                👨
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">남성</span>
            </button>

            <button
              onClick={() => handleGenderSelect('female')}
              className="w-full p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-3xl flex items-center space-x-4 hover:border-green-400 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                👩
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">여성</span>
            </button>
          </div>

          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-16">
            더 나은 서비스 제공을 위한 설문입니다
          </p>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-12">
            나이를 선택해주세요
          </h1>

          <div className="space-y-4">
            {[
              { emoji: '👶', label: '10대' },
              { emoji: '👦', label: '20대' },
              { emoji: '👨', label: '30대' },
              { emoji: '👴', label: '40대' },
              { emoji: '👵', label: '50대 이상' },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => handleAgeSelect(option.label as AdditionalInfoRequest['age'])}
                className={`
                  w-full p-6 bg-white dark:bg-gray-800 border-2 rounded-3xl flex items-center space-x-4 transition-colors
                  ${
                    age === option.label
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }
                `}
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                  {option.emoji}
                </div>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {option.label}
                </span>
                {age === option.label && (
                  <div className="ml-auto w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              disabled={!age || isSubmitting}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full mr-2"></div>
                  처리 중...
                </div>
              ) : (
                '완료'
              )}
            </Button>
          </div>

          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
            더 나은 서비스 제공을 위한 설문입니다
          </p>
        </motion.div>
      )}
    </PageLayout>
  );
}

export default withAuth(BasicInfoPage);
