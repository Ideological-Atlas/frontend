import { useAtlasStore } from '@/store/useAtlasStore';
import { AnswersService } from '@/lib/client/services/AnswersService';
import type { UserAxisAnswerUpsertRequest } from '@/lib/client/models/UserAxisAnswerUpsertRequest';
import type { ConditionerAnswerUpsertRequest } from '@/lib/client/models/ConditionerAnswerUpsertRequest';

export async function syncLocalAnswersToProfile(skipRemoteCheck = false) {
  const store = useAtlasStore.getState();
  const { answers, conditionerAnswers, complexities, sections } = store;

  const hasLocalAnswers = Object.keys(answers).length > 0 || Object.keys(conditionerAnswers).length > 0;

  if (!hasLocalAnswers) {
    console.log('No local answers to sync.');
    return;
  }

  try {
    let hasRemoteData = false;

    if (!skipRemoteCheck && complexities.length > 0) {
      const firstComp = complexities[0];
      const compSections = sections[firstComp.uuid];

      if (compSections && compSections.length > 0) {
        const firstSection = compSections[0];
        try {
          const remoteAxes = await AnswersService.answersAxisListList(firstSection.uuid, 1);
          if (remoteAxes.results.length > 0) {
            hasRemoteData = true;
          }
        } catch (err) {
          console.warn('Error checking remote data, assuming empty or proceeding cautiously', err);
        }
      }
    }

    if (!hasRemoteData) {
      console.log('Syncing local answers to profile via individual POSTs...');

      const conditionerPromises = Object.entries(conditionerAnswers).map(([uuid, value]) => {
        const payload: ConditionerAnswerUpsertRequest = { answer: value };
        return AnswersService.answersConditionerCreate(uuid, payload);
      });

      const axisPromises = Object.entries(answers).map(([uuid, data]) => {
        const payload: UserAxisAnswerUpsertRequest = {
          value: data.value,
          margin_left: data.margin_left,
          margin_right: data.margin_right,
          is_indifferent: data.is_indifferent,
        };
        return AnswersService.answersAxisCreate(uuid, payload);
      });

      await Promise.all([...conditionerPromises, ...axisPromises]);

      console.log('Sync complete.');
    } else {
      console.log('Remote data found, skipping sync to avoid overwrite.');
    }
  } catch (error) {
    console.error('Error syncing local answers:', error);
  }
}
