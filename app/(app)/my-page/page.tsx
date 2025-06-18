'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  Settings,
  Bell,
  HelpCircle,
  ChevronRight,
  Calendar,
  TrendingUp,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

interface UserInfo {
  name: string;
  email: string;
  profileImage: string;
  userType: string;
  joinDate: string;
  lastSurveyDate: string;
  completedMissions: number;
  familyMembers: number;
}

interface SurveyResult {
  type: string;
  description: string;
  recommendedPlan: string;
  date: string;
}

export default function MyPage() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '사용자',
    email: 'user@example.com',
    profileImage: '/images/modi.png',
    userType: '절약형',
    joinDate: '2024.01.15',
    lastSurveyDate: '2024.01.20',
    completedMissions: 12,
    familyMembers: 4,
  });

  const [surveyResults, setSurveyResults] = useState<SurveyResult[]>([
    {
      type: '절약형',
      description: '데이터 사용량이 적고 비용 효율을 중시하는 유형',
      recommendedPlan: 'LTE 라이트 요금제',
      date: '2024.01.20',
    },
    {
      type: '가족형',
      description: '가족 구성원이 많아 결합 할인이 유리한 유형',
      recommendedPlan: '가족사랑 결합 요금제',
      date: '2024.01.10',
    },
  ]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">마이페이지</h1>
        <ThemeToggle />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 pb-20">
          {/* User Profile Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {userInfo.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{userInfo.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs">
                      {userInfo.userType}
                    </Badge>
                    <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                      가입일: {userInfo.joinDate}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Info Details */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">사용자 정보</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">마지막 성향 검사</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {userInfo.lastSurveyDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">현재 유형</span>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300">
                    {userInfo.userType}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {userInfo.completedMissions}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">완료한 미션</div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {userInfo.familyMembers}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">가족 구성원</div>
              </CardContent>
            </Card>
          </div>

          {/* Survey Results History */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  지난 요금제 추천 기록
                </h3>
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {surveyResults.map((result, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs">
                        {result.type}
                      </Badge>
                      <span className="text-xs text-gray-400">{result.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {result.description}
                    </p>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      추천: {result.recommendedPlan}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* New Survey Button */}
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 shadow-sm border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-2">새로운 요금제 추천받기</h3>
                <p className="text-green-100 text-sm mb-4">최신 사용 패턴을 반영한 맞춤 추천</p>
                <Link href="/survey">
                  <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
                    성향 검사 시작하기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          <div className="space-y-3">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardContent className="p-0">
                <Link
                  href="/settings"
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">설정</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        알림, 개인정보 설정
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardContent className="p-0">
                <Link
                  href="/notifications"
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">알림</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">푸시 알림 관리</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardContent className="p-0">
                <Link
                  href="/help"
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">도움말</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">자주 묻는 질문</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* App Info */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-white text-2xl">🌱</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                모디 (MODI)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">버전 1.0.0</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
