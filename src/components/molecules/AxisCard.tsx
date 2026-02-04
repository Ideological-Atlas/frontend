'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { Slider } from '@/components/atoms/Slider';
import { DependencyBadge } from '@/components/atoms/DependencyBadge';
import { AxisHeader } from './axis/AxisHeader';
import { AxisControls } from './axis/AxisControls';
import type { IdeologyAxis } from '@/lib/client/models/IdeologyAxis';
import type { AnswerData, AnswerUpdatePayload } from '@/store/useAtlasStore';
import { useAxisInteraction } from '@/hooks/features/atlas/useAxisInteraction';

interface AxisCardProps {
  id?: string;
  axis: IdeologyAxis;
  onSave?: (uuid: string, data: AnswerUpdatePayload) => void;
  onDelete?: (uuid: string) => void;
  answerData?: AnswerData;
  otherAnswerData?: AnswerData;
  affinity?: number;
  viewerUsername?: string;
  targetUsername?: string;
  hasTargetUser?: boolean;
  dependencyNames: string[];
  readOnly?: boolean;
  variant?: 'default' | 'other';
  customHexColor?: string;
  otherCustomColor?: string;
}

export function AxisCard({
  id,
  axis,
  onSave,
  onDelete,
  answerData,
  otherAnswerData,
  affinity,
  viewerUsername,
  targetUsername,
  hasTargetUser = false,
  dependencyNames,
  readOnly = false,
  variant = 'default',
  customHexColor,
  otherCustomColor,
}: AxisCardProps) {
  const t = useTranslations('Atlas');
  const { state, actions } = useAxisInteraction({
    axisUuid: axis.uuid,
    answerData,
    onSave,
    onDelete,
    readOnly,
  });

  const isOther = variant === 'other';
  const effectiveHasTarget = hasTargetUser || !!targetUsername;
  const isComparisonView = effectiveHasTarget;

  const meHasAnswer = answerData && (answerData.value !== null || answerData.is_indifferent);
  const themHasAnswer = otherAnswerData && (otherAnswerData.value !== null || otherAnswerData.is_indifferent);
  const themIsIndifferent = otherAnswerData?.is_indifferent ?? false;
  const themIsNotAnswered = !themHasAnswer;
  const showThemAsNotAnswered = isComparisonView && themIsNotAnswered;
  const canCopy = !!(meHasAnswer && (themHasAnswer || themIsIndifferent));

  const marginOptions = [0, 5, 10, 15, 20, 25, 30, 40, 50];
  const isSymmetric = state.marginLeft === state.marginRight;
  const marginDisplayValue = isSymmetric ? state.marginLeft : t('asymmetric_label');

  const activeBorderClass = isOther ? 'border-other-user' : 'border-primary';
  const activeBgClass = isOther ? 'bg-other-user/5' : 'bg-primary/5';

  const cardStyle = isComparisonView
    ? 'bg-card border-border'
    : meHasAnswer && !state.isIndifferent
      ? `${activeBorderClass} ${activeBgClass}`
      : 'bg-card border-border';

  const customStyle =
    customHexColor && meHasAnswer && !state.isIndifferent
      ? { borderColor: customHexColor, backgroundColor: `${customHexColor}0D` }
      : undefined;

  const isTarget = id === 'atlas-first-axis';

  return (
    <div
      id={id}
      className={clsx(
        'relative flex flex-col gap-6 rounded-xl border p-6 shadow-sm transition-all duration-300',
        !readOnly && 'hover:shadow-md',
        !customHexColor && cardStyle,
        state.isIndifferent && !otherAnswerData && !effectiveHasTarget ? 'opacity-75' : '',
        state.isDropdownOpen ? 'z-50' : 'z-0',
      )}
      style={customStyle}
    >
      <DependencyBadge names={dependencyNames} variant={variant} />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AxisHeader
          axis={axis}
          isTarget={isTarget}
          activeTitleClass={isOther ? 'text-other-user' : 'text-primary'}
          customHexColor={customHexColor}
          hasAnswer={!!meHasAnswer}
          isIndifferent={state.isIndifferent}
          isComparisonView={isComparisonView}
          affinity={themIsNotAnswered ? undefined : affinity}
          sliderOtherAnswer={otherAnswerData}
          canCopy={canCopy}
          onCopy={() => otherAnswerData && actions.handleCopyFromOther(otherAnswerData)}
          readOnly={readOnly}
        />

        <AxisControls
          hasAnswer={!!meHasAnswer}
          isIndifferent={state.isIndifferent}
          readOnly={readOnly}
          marginDisplayValue={marginDisplayValue}
          marginOptions={marginOptions}
          onDropdownChange={actions.handleDropdownChange}
          onReset={actions.handleReset}
          onDropdownOpenChange={actions.setIsDropdownOpen}
          isComparisonMode={!!otherAnswerData}
        />
      </div>

      {!readOnly && (
        <div id={isTarget ? 'atlas-axis-indifferent' : undefined} className="flex items-center gap-2">
          <button
            onClick={actions.toggleIndifferent}
            disabled={readOnly}
            className={clsx(
              'flex h-5 w-5 items-center justify-center rounded border transition-colors',
              state.isIndifferent
                ? 'bg-primary border-primary'
                : 'border-muted-foreground hover:border-foreground bg-transparent',
              readOnly && 'cursor-default opacity-50',
            )}
            style={
              state.isIndifferent && customHexColor
                ? { backgroundColor: customHexColor, borderColor: customHexColor }
                : undefined
            }
          >
            {state.isIndifferent && (
              <span className="material-symbols-outlined text-primary-foreground text-[16px] font-bold">check</span>
            )}
          </button>
          <button
            onClick={actions.toggleIndifferent}
            disabled={readOnly}
            className={clsx('text-muted-foreground text-sm transition-colors', !readOnly && 'hover:text-foreground')}
          >
            {t('indifferent_label')}
          </button>
        </div>
      )}

      <div
        id={isTarget ? 'atlas-axis-slider' : undefined}
        className={clsx(
          'relative z-10 px-2 pb-2 transition-opacity duration-300',
          state.isIndifferent && !otherAnswerData ? 'opacity-75' : '',
        )}
      >
        <Slider
          leftLabel={axis.left_label}
          rightLabel={axis.right_label}
          value={state.value}
          marginLeft={state.marginLeft}
          marginRight={state.marginRight}
          bottomLabel={viewerUsername ? `@${viewerUsername}` : t('your_answer_label')}
          isIndifferent={state.isIndifferent}
          indifferentLabel={t('indifferent_status')}
          isNotAnswered={readOnly && !meHasAnswer}
          notAnsweredLabel={t('not_answered_status')}
          otherValue={otherAnswerData?.value ?? undefined}
          otherMarginLeft={otherAnswerData?.margin_left ?? undefined}
          otherMarginRight={otherAnswerData?.margin_right ?? undefined}
          otherIsIndifferent={themIsIndifferent}
          otherIsNotAnswered={showThemAsNotAnswered}
          otherNotAnsweredLabel={t('not_answered_status')}
          otherIndifferentLabel={t('indifferent_status')}
          topLabel={
            targetUsername
              ? targetUsername.startsWith('@')
                ? targetUsername
                : `@${targetUsername}`
              : t('their_answer_label')
          }
          onChange={actions.handleSliderChange}
          onCommit={actions.handleCommit}
          onThumbWheel={actions.handleThumbWheel}
          readOnly={readOnly}
          variant={variant}
          customHexColor={customHexColor}
          otherCustomColor={otherCustomColor}
        />
      </div>
    </div>
  );
}
