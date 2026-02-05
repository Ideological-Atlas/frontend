'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';
import { Modal } from '@/components/molecules/Modal';
import { StatusMessage } from '@/components/molecules/StatusMessage';
import { useUnverifiedWarning } from '@/hooks/auth/useUnverifiedWarning';

export function UnverifiedWarningModal() {
  const t = useTranslations('Atlas');
  const { isOpen, dismiss } = useUnverifiedWarning();

  return (
    <Modal isOpen={isOpen} onClose={dismiss}>
      <div className="flex flex-col items-center bg-amber-500/5 p-8 text-center">
        <StatusMessage
          icon="cloud_off"
          title={t('unverified_warning.title')}
          description={t('unverified_warning.description')}
          iconClassName="text-amber-600 dark:text-amber-500"
          className="mb-8"
        />

        <div className="flex w-full justify-center">
          <Button variant="primary" onClick={dismiss} className="w-full shadow-lg">
            {t('unverified_warning.dismiss')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
