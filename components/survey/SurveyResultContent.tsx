'use client';

/**

<설문조사 결과 페이지 컴포넌트>

URL 쿼리에서 bugId를 받아 사용자 유형 결과 조회

bugId에 해당하는 사용자 유형 정보 및 추천 요금제 표시

Intersection Observer를 통해 단계적 애니메이션 출력

추천 요금제 클릭 시 외부 상세 페이지로 이동

사용 Hook:

useGetSurveyResult: 설문 결과 API 조회

useInViewOnce: 컴포넌트 뷰포트 진입 시 1회 렌더 트리거

주요 UI 요소:

사용자 유형 캐릭터 + 설명

추천 혜택 리스트

추천 요금제 카드 리스트
*/

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, X, ArrowLeft, Share2 } from 'lucide-react';
import { useGetSurveyResult } from '@/hooks/use-survey-result';
import { bugNameUiMap } from '@/types/survey.type';
import { planDetails, userTypes, typeImageMap, bugIdToNameMap } from '@/lib/survey-result-data';
import { useInView } from 'react-intersection-observer';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useKakaoInit, shareSurveyResult } from '@/hooks/useKakaoShare';
import { toast } from 'sonner';
import { FullScreenLoading } from '@/components/ui/loading';
import { useAuthStore } from '@/store/useAuthStore';

// bugId에 따른 추천 이유 매핑
const getRecommendationReason = (bugId: number): string => {
  switch (bugId) {
    case 1: // 호박벌형
      return '출퇴근길 유튜브·릴스 루틴이 필수라면?<br/>무제한 데이터에 유튜브/디즈니+ 혜택까지!<br/>스트리밍족을 위한 완벽한 조합이에요🍯';
    case 2: // 무당벌레형
      return '하루 통화량이 많다면 무제한 음성통화는 기본!<br/>50GB/14GB 데이터로 메시지도 걱정 없이.<br/>통화가 일상인 당신에게 꼭 맞는 요금제예요☎️';
    case 3: // 라바형 (기존 개미형)
      return '매달 요금 걱정된다면?<br/>데이터·통화 기본은 챙기고,<br/>월 4~5만 원대 실속형 요금제 조합이에요💸';
    case 4: // 나비형
      return '유튜브, 넷플릭스, 디즈니+까지?!<br/>최대 4개 OTT 중 택1 무료 제공!<br/>혜택 다 챙기고 싶은 당신을 위한 프리미엄 선택🦋';
    case 5: // 장수풍뎅이형 (가족형)
      return '가족 전체의 통신비를 챙겨야 한다면?<br/>무제한 통화·데이터에 넷플릭스·디즈니 혜택!<br/>든든하게 챙길 수 있는 대표 요금제 조합!';
    default:
      return '당신에게 최적화된 요금제를 추천해드려요!';
  }
};

export default function SurveyResultContent() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // 상태 관리
  const [hasAnimatedBenefit, setHasAnimatedBenefit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoaded, error } = useKakaoInit(); // Initialize Kakao SDK
  const [isSharing, setIsSharing] = useState(false);

  // URL에서 bugId와 mission 파라미터 가져오기
  const searchParams = useSearchParams();
  const bugId = searchParams.get('bugId') ? Number.parseInt(searchParams.get('bugId')!) : null;
  const isFromMission = searchParams.get('mission') === 'true';

  const {
    data: surveyResult,
    isLoading,
    isError,
  } = useGetSurveyResult(bugId!, { enabled: !!bugId });

  // react-intersection-observer 사용
  const { ref: benefitRef, inView: benefitInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // 애니메이션 상태 관리
  useEffect(() => {
    if (benefitInView && !hasAnimatedBenefit) {
      setHasAnimatedBenefit(true);
    }
  }, [benefitInView, hasAnimatedBenefit]);

  // 요금제 자세히 보기 핸들러
  const handleShowPlans = () => {
    setIsModalOpen(true);
  };

  // 미로그인 사용자용 포인트 핸들러
  const handlePointUnauthenticated = () => {
    toast.info('포인트 적립은 로그인 후 이용 가능합니다.');
    setIsModalOpen(true);
  };

  if (isError || !bugId) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          {isError ? '오류가 발생했습니다' : '잘못된 접근입니다'}
        </h2>
        <p className="text-gray-600">
          {isError ? '결과를 불러오는 데 실패했습니다.' : '올바른 경로로 접근해주세요.'}
        </p>
      </div>
    );
  }

  // isLoading은 Suspense의 fallback으로 처리되므로, surveyResult가 아직 없을 때 로딩 처리
  if (!surveyResult) {
    return <FullScreenLoading size="lg" />;
  }

  const displayName = bugIdToNameMap[bugId] || '개미형';
  const userType = userTypes[displayName];
  const imageSrc = typeImageMap[displayName] || '/images/ant.png';

  const finalUserType = {
    ...userType,
    description: userType.description,
    message: userType.message,
    recommendations: [
      planDetails[surveyResult.suggest1]?.name,
      planDetails[surveyResult.suggest2]?.name,
    ].filter(Boolean) as string[],
  };

  const recommendationReason = getRecommendationReason(bugId);

  const handleShare = async () => {
    if (!isLoaded) {
      // SDK가 로드되지 않은 경우에도 재시도
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
        if (!window.Kakao || !window.Kakao.isInitialized()) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }
      } catch (error) {
        console.error('Kakao SDK 초기화 실패:', error);
        alert('공유하기 기능을 불러오는 중입니다. 잠시만 기다려주세요.');
        return;
      }
    }

    try {
      setIsSharing(true);
      await shareSurveyResult(bugId!, displayName);
    } catch (error) {
      console.error('Failed to share:', error);
      alert('공유하기에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-50 min-h-screen w-full survey-result-page">
      <div className="max-w-md mx-auto">
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (isAuthenticated) {
                router.push('/chat');
              } else {
                router.push('/');
              }
            }}
            aria-label={isAuthenticated ? '챗봇으로 이동' : '홈으로 이동'}
            className="hover:bg-transparent focus:bg-transparent"
          >
            <ArrowLeft className="w-6 h-6" style={{ color: '#000' }} />
          </Button>
        </div>
        <div className="p-6 pt-0 space-y-6">
          {/* 설문조사 결과 */}
          <div className="space-y-4">
            {/* 캐릭터 이미지 */}
            <div className="text-center mb-6">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              >
                <Image
                  src={imageSrc || '/placeholder.svg'}
                  alt={finalUserType.type}
                  width={150}
                  height={150}
                  className="mx-auto mb-4"
                  priority
                />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgb(62 73 68)' }}>
                {finalUserType.type}
              </h2>
            </div>

            {/* 특성 카드 */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-gray-800 text-center">
                  {finalUserType.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-center">
                {finalUserType.description.split('\n').map((line, index) => (
                  <p key={index} className="text-gray-700 text-sm leading-relaxed">
                    {line.trim()}
                  </p>
                ))}
              </CardContent>
            </Card>

            {/* 메시지 */}
            <div className="text-center py-2 m-8">
              <p className="text-[#6e6e6e] text-m italic m-8">"{finalUserType.message}"</p>
            </div>
          </div>

          {/* 추천 이유 */}
          <div
            ref={benefitRef}
            className={`transition-all duration-700 ease-out ${
              hasAnimatedBenefit ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-base font-bold text-gray-800">이 요금제를 추천해요!</h3>
                    </div>
                    <p
                      className="text-gray-600 text-sm leading-relaxed pl-1"
                      dangerouslySetInnerHTML={{ __html: recommendationReason }}
                    />
                  </div>
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-xl">😊</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 가족 결합 혜택 섹션 (bugId === 5이고 로그인된 사용자일 때만) */}
          {bugId === 5 && isAuthenticated && <AuthenticatedFamilySection router={router} />}

          {/* 하단 안내 텍스트 */}
          <div className="text-center pt-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            >
              <p className="text-[#6e6e6e] text-sm">
                {isAuthenticated && isFromMission
                  ? '요금제 조회하고 포인트도 받아보세요 ↓'
                  : isAuthenticated
                  ? '추천 요금제 보고 포인트 쌓을 수 있어요 ↓'
                  : '추천 요금제를 확인해보세요 ↓'}
              </p>
            </motion.div>
          </div>

          {/* 요금제 추천 보고 포인트 받기 버튼 */}
          <div className="pb-8 mt-0">
            {isAuthenticated ? (
              <AuthenticatedButton
                isFromMission={isFromMission}
                onModalOpen={() => setIsModalOpen(true)}
              />
            ) : (
              <Button
                onClick={handleShowPlans}
                className="w-full !bg-[#53a2f5] hover:!bg-[#3069a6] text-white py-4 rounded-2xl text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                요금제 조회하기
              </Button>
            )}
          </div>

          {/* 카카오톡 공유 버튼 또는 카카오 로그인 버튼 */}
          <div className="flex justify-center mt-8 mb-12">
            {isAuthenticated ? (
              <Button
                onClick={handleShare}
                disabled={isSharing}
                className="bg-[#FEE500] hover:bg-[#FEE500]/90 text-black flex items-center gap-2 px-6 py-2 rounded-full shadow-md disabled:opacity-50"
              >
                {isSharing ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
                {isSharing ? '공유하는 중...' : '카카오톡으로 공유하기'}
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full">
                <p className="text-sm text-gray-600 text-center">
                  로그인하고 더 많은 기능을 이용해보세요!
                </p>
                <div className="pb-8 mt-0 w-full">
                  <Button
                    onClick={() => router.push('/')}
                    className="w-full !bg-[#FEE500] hover:!bg-[#FEE500]/90 text-black py-4 rounded-2xl text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    로그인 하러 가기
                  </Button>
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">
                  로그인 후 포인트 적립과 공유 기능을 이용하실 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-l font-bold text-gray-800">추천 요금제</h3>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6 space-y-4">
              {[surveyResult.suggest1, surveyResult.suggest2].map((planId, index) => {
                if (!planId || !planDetails[planId]) return null;
                const plan = planDetails[planId];
                const isFirstPlan = index === 0;

                return (
                  <Card
                    key={plan.name}
                    className={`relative bg-white rounded-2xl border-[1px] shadow-sm border-[#cccccc]`}
                  >
                    <CardContent className="p-6">
                      {/* 추천 배지 */}
                      {isFirstPlan && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-[#53a2f5] text-white text-xs px-3 py-1 rounded-full font-semibold">
                            추천
                          </span>
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* 헤더 영역 */}
                        <div className="pr-16">
                          <p className="text-xs mb-2 uppercase tracking-wide text-[#5b85b1] font-semibold">
                            {plan.description}
                          </p>
                          <h3 className="text-l font-bold text-gray-900 leading-tight">
                            {plan.name}
                          </h3>
                        </div>

                        {/* 가격 영역 */}
                        <div className="flex justify-between items-end">
                          <div></div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                          </div>
                        </div>

                        {/* 버튼 영역 */}
                        <Button
                          className={`w-full py-3 rounded-xl transition-all duration-300 ${
                            isFirstPlan
                              ? '!bg-[#53a2f5] hover:!bg-[#3069a6] text-white'
                              : 'bg-white border-2 border-[#53a2f5] text-[#53a2f5] hover:bg-[#eaf4fd]'
                          }`}
                          onClick={() => window.open(plan.link, '_blank')}
                        >
                          요금제 자세히 보기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 인증된 사용자용 가족 섹션 컴포넌트
const AuthenticatedFamilySection = ({ router }: { router: any }) => {
  return null; // 인증된 사용자만 접근 가능한 기능은 추후 구현
};

// 인증된 사용자용 버튼 컴포넌트
const AuthenticatedButton = ({
  isFromMission,
  onModalOpen,
}: {
  isFromMission: boolean;
  onModalOpen: () => void;
}) => {
  return (
    <Button
      onClick={() => {
        toast.info('포인트 적립은 로그인 후 이용 가능합니다.');
        onModalOpen();
      }}
      className="w-full !bg-[#53a2f5] hover:!bg-[#3069a6] text-white py-4 rounded-2xl text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
    >
      {isFromMission ? '요금제 추천 보고 포인트 받기' : '요금제 조회하기'}
    </Button>
  );
};
