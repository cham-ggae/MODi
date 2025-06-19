# MODi - 스마트한 통신 생활의 시작

개인 맞춤형 요금제 추천 및 가족 통신 관리 서비스

## 🚀 시작하기

### 필수 의존성 설치

```bash
pnpm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# API 서버 주소
NEXT_PUBLIC_ADDR=http://localhost:8090

# 카카오 OAuth 설정
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id
NEXT_PUBLIC_KAKAO_REDIRECT_URI=http://localhost:3000/login/callback
```

### 개발 서버 실행

```bash
pnpm dev
```

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
│   │   ├── page.tsx       # 로그인 페이지
│   │   └── callback/      # OAuth 콜백 처리
│   ├── basic-info/        # 기본 정보 입력
│   ├── chat/              # AI 상담
│   ├── family-space/      # 가족 공간
│   └── plant-game/        # 식물 게임
├── components/            # 재사용 가능한 컴포넌트
│   ├── providers/         # 프로바이더 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   └── ...
├── hooks/                # 커스텀 훅
├── lib/                  # 유틸리티 및 API
├── store/                # Zustand 스토어
└── contexts/             # React Context
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
import { withAuth } from '@/components/providers/AuthProvider';

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
