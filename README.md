# MODi - 스마트한 통신 생활의 시작

본 프로젝트 **MODi**는 **"기술이 가족을 연결할 수 있다"**는 생각에서 시작된 웹 기반 챗봇 플랫폼입니다. 통신사 요금제 추천과 가족 소통을 융합한 서비스로, 개인과 가족이 함께 요금제를 비교하고 비용을 절감할 수 있도록 도와줍니다.

**가족 스페이스** 기능을 통해 초대코드로 가족을 초대하고, 공동 목표인 **새싹 키우기**를 통해 가족 간 소통과 협력을 유도합니다.

**맞춤형 챗봇**은 사용자의 통신 성향을 분석해 최적의 요금제를 추천하며, **음성 기능(TTS/STT)**을 지원합니다.

MODi는 단순한 비용 절약을 넘어, 가족 간 정서적 유대감을 강화하고, 세대 간 디지털 격차를 해소하는 새로운 패밀리테크 경험을 제공합니다.

## 🔧 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **API Client**: Axios, React Query
- **UI Components**: Radix UI, Lucide React
- **Authentication**: Kakao OAuth

## 📁 프로젝트 구조

```
MODi/
├── app/                    # Next.js App Router
│   ├── login/             # 로그인 관련 페이지
│   └── (app)/             # 메인 콘텐츠 그룹
│       ├── basic-info/    # 기본 정보 입력
│       ├── chat/          # AI 상담
│       ├── family-space/  # 가족 공간
│       ├── family-space-tutorial/  # 가족 공간 튜토리얼
│       ├── my-page/       # 마이페이지
│       ├── plant-game/    # 식물 게임
│       ├── plant-selection/  # 식물 선택
│       ├── result/        # 결과 페이지
│       ├── survey/        # 설문조사
│       └── survey-result/ # 설문 결과
├── components/            # 재사용 가능한 컴포넌트
│   ├── chat/              # 채팅 관련 컴포넌트
│   ├── family-space/      # 가족 공간 관련 컴포넌트
│   ├── layouts/           # 레이아웃 컴포넌트
│   ├── login/             # 로그인 관련 컴포넌트
│   ├── my-page/           # 마이페이지 컴포넌트
│   ├── plant/             # 식물 관련 컴포넌트
│   ├── plant-game/        # 식물 게임 컴포넌트
│   ├── plant-selection/   # 식물 선택 컴포넌트
│   ├── providers/         # 프로바이더 컴포넌트
│   ├── survey/            # 설문조사 컴포넌트
│   └── ui/                # 기본 UI 컴포넌트 (Radix UI 기반)
├── contexts/              # React Context
├── hooks/                 # 커스텀 훅
│   ├── family/            # 가족 관련 훅
│   └── plant/             # 식물 관련 훅
├── lib/                   # 유틸리티 및 API
│   └── api/               # API 클라이언트
├── public/                # 정적 파일
│   ├── animations/        # 애니메이션 파일
│   ├── images/            # 이미지 파일
│   └── videos/            # 비디오 파일
├── services/              # 서비스 레이어
├── store/                 # Zustand 스토어
├── styles/                # 스타일 파일
└── types/                 # TypeScript 타입 정의
```

## 🔐 인증 시스템

### 로그인 플로우

1. **메인 페이지** (`/`): 로그인 상태에 따른 조건부 버튼
2. **콜백 페이지** (`/login/callback`): OAuth 콜백 처리

### 상태 관리

- **Zustand Store**: 전역 인증 상태 관리
- **localStorage**: 토큰 영속성
- **Axios Interceptors**: 자동 토큰 첨부 및 갱신

### 보호된 라우트

인증이 필요한 페이지는 `withAuth` HOC로 보호됩니다:

```tsx
import { withAuth } from "@/components/providers/AuthProvider";

function ProtectedPage() {
  return <div>인증이 필요한 페이지</div>;
}

export default withAuth(ProtectedPage);
```

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일 우선 접근법
- **다크 모드**: 시스템 설정에 따른 자동 전환
- **애니메이션**: Framer Motion을 활용한 부드러운 전환
- **접근성**: Radix UI 기반의 접근성 고려

## 🔄 API 통신

### 자동 토큰 관리

- 요청 시 JWT 토큰 자동 첨부
- 토큰 만료 시 자동 갱신
- 갱신 실패 시 자동 로그아웃

### 에러 처리

- 네트워크 오류 시 사용자 친화적 메시지
- 재시도 로직 (React Query)
- 토스트 알림 시스템

## 🚀 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 환경 변수 설정

배포 환경에서 다음 환경 변수를 설정하세요:

- `NEXT_PUBLIC_ADDR`: 프로덕션 API 서버 주소
- `NEXT_PUBLIC_KAKAO_CLIENT_ID`: 카카오 앱 ID
- `NEXT_PUBLIC_KAKAO_REDIRECT_URI`: 프로덕션 콜백 URL

## 📝 개발 가이드

### 새로운 페이지 추가

1. `app/` 디렉토리에 새 폴더 생성
2. `page.tsx` 파일 생성
3. 필요시 `withAuth` HOC 적용

### 새로운 API 엔드포인트 추가

1. `lib/api/` 디렉토리에 새 파일 생성
2. `apiClient` 또는 `authenticatedApiClient` 사용
3. React Query 훅 생성 (선택사항)

### 스타일링

- Tailwind CSS 클래스 사용
- 컴포넌트별 스타일 모듈화
- 다크 모드 고려

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
