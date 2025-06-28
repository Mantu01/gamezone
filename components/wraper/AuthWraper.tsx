'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loading from './Loading';
import { useUser } from '@/context/UserContext';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const router = useRouter();
  const { username, isLoading } = useUser();
  const pathname=usePathname();

  useEffect(() => {
    if (!isLoading && !username && pathname!=='/') {
      router.replace('/');
    }
    if(username && pathname==='/'){
      router.replace('/home')
    }
  }, [isLoading, username, router,pathname]);

  if ((isLoading || !username) && pathname !== '/') {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
