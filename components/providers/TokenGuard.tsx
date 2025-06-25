import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { FullScreenLoading } from '@/components/ui/loading';

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
      return <FullScreenLoading />;
    }

    if (!accessToken) {
      return null;
    }

    return <Component {...props} />;
  };
}
