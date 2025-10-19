'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ScreenLoader } from '@/components/common/screen-loader';
import { Demo1Layout } from '../components/layouts/demo1/layout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const authDisabled = process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true';

  // When auth is disabled, render immediately without redirects or session checks
  if (authDisabled) {
    return <Demo1Layout>{children}</Demo1Layout>;
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <ScreenLoader />;
  }

  return session ? <Demo1Layout>{children}</Demo1Layout> : null;
}
