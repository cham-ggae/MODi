import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export function withTokenGuard<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/'
) {
  return function TokenGuardedComponent(props: P) {
    const { accessToken, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !accessToken) {
        router.push(redirectTo);
      }
    }, [isLoading, accessToken, router, redirectTo]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#81C784] border-t-transparent animate-spin rounded-full"></div>
        </div>
      );
    }

    if (!accessToken) {
      return null;
    }

    return <Component {...props} />;
  };
}
