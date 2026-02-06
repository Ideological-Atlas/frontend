import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/client/services/AuthService';
import { ApiError } from '@/lib/client/core/ApiError';
import { useConfetti } from '@/hooks/useConfetti';

export type VerifyState = 'loading' | 'success' | 'already_verified' | 'error';

export function useVerifyUser(uuid: string) {
  const [status, setStatus] = useState<VerifyState>('loading');
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    const verify = async () => {
      if (!uuid) {
        setStatus('error');
        return;
      }
      try {
        await AuthService.usersVerifyPartialUpdate('-', uuid);
        setStatus('success');
        triggerConfetti();
      } catch (error) {
        if (error instanceof ApiError && error.status === 403) {
          setStatus('already_verified');
        } else {
          setStatus('error');
        }
      }
    };

    verify();
  }, [uuid, triggerConfetti]);

  return { status };
}
