import { useState } from 'react';
import { AnswersService } from '@/lib/client/services/AnswersService';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore } from '@/store/useAtlasStore';
import type { CompletedAnswerRequest } from '@/lib/client/models/CompletedAnswerRequest';

export function useAtlasSharing() {
  const { isAuthenticated, user } = useAuthStore();
  const { answers, conditionerAnswers } = useAtlasStore();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);

  const handleShare = async () => {
    setIsGeneratingShare(true);
    try {
      let requestBody: CompletedAnswerRequest | undefined = undefined;
      const isVerified = user?.is_verified ?? false;

      // If not authenticated OR authenticated but not verified, send local state
      if (!isAuthenticated || !isVerified) {
        const axisList = Object.entries(answers).map(([uuid, data]) => ({
          uuid,
          value: data.value,
          margin_left: data.margin_left ?? 0,
          margin_right: data.margin_right ?? 0,
        }));

        const conditionersList = Object.entries(conditionerAnswers).map(([uuid, value]) => ({
          uuid,
          value,
        }));

        requestBody = {
          axis: axisList,
          conditioners: conditionersList,
        };
      }

      const response = await AnswersService.answersCompletedGenerateCreate(requestBody);
      const origin = window.location.origin;
      const url = `${origin}/answers/${response.uuid}`;
      setShareUrl(url);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error('Error generating completed answer:', error);
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const closeShareModal = () => setIsShareModalOpen(false);

  return {
    isShareModalOpen,
    shareUrl,
    isGeneratingShare,
    handleShare,
    closeShareModal,
  };
}
