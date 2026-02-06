import { useState, useEffect, useCallback, useRef } from 'react';
import type { AnswerData, AnswerUpdatePayload } from '@/store/useAtlasStore';

interface UseAxisInteractionProps {
  axisUuid: string;
  answerData?: AnswerData;
  onSave?: (uuid: string, data: AnswerUpdatePayload) => void;
  onDelete?: (uuid: string) => void;
  readOnly?: boolean;
}

export function useAxisInteraction({ axisUuid, answerData, onSave, onDelete, readOnly }: UseAxisInteractionProps) {
  const [value, setValue] = useState(0);
  const [marginLeft, setMarginLeft] = useState(25);
  const [marginRight, setMarginRight] = useState(25);
  const [isIndifferent, setIsIndifferent] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (answerData) {
      const newValue = answerData.value ?? 0;
      const newIndifferent = answerData.is_indifferent ?? false;

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(prev => (prev !== newValue ? newValue : prev));

      setIsIndifferent(prev => (prev !== newIndifferent ? newIndifferent : prev));

      const newMl = answerData.margin_left;
      const newMr = answerData.margin_right;

      if (newMl !== undefined && newMl !== null) {
        setMarginLeft(newMl);
      } else if (!isMounted.current) {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        setMarginLeft(isMobile ? 35 : 25);
      }

      if (newMr !== undefined && newMr !== null) {
        setMarginRight(newMr);
      } else if (!isMounted.current) {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        setMarginRight(isMobile ? 35 : 25);
      }
    } else {
      setValue(0);
      setIsIndifferent(false);
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      setMarginLeft(isMobile ? 35 : 25);
      setMarginRight(isMobile ? 35 : 25);
    }
  }, [answerData]);

  const commitSave = useCallback(
    (payload: AnswerUpdatePayload) => {
      if (readOnly || !onSave) return;
      onSave(axisUuid, payload);
    },
    [axisUuid, onSave, readOnly],
  );

  const handleSliderChange = useCallback(
    (updates: { value?: number; marginLeft?: number; marginRight?: number }) => {
      if (readOnly || isIndifferent) return;

      if (updates.value !== undefined) setValue(updates.value);
      if (updates.marginLeft !== undefined) setMarginLeft(updates.marginLeft);
      if (updates.marginRight !== undefined) setMarginRight(updates.marginRight);
    },
    [readOnly, isIndifferent],
  );

  const handleCommit = useCallback(() => {
    commitSave({ value, margin_left: marginLeft, margin_right: marginRight, is_indifferent: false });
  }, [commitSave, value, marginLeft, marginRight]);

  const handleThumbWheel = useCallback(
    (delta: number) => {
      if (readOnly || isIndifferent) return;

      let newMl = marginLeft + delta;
      let newMr = marginRight + delta;

      if (newMl < 0) newMl = 0;
      if (newMr < 0) newMr = 0;

      const maxMl = value + 100;
      const maxMr = 100 - value;

      if (newMl > maxMl) newMl = maxMl;
      if (newMr > maxMr) newMr = maxMr;

      setMarginLeft(newMl);
      setMarginRight(newMr);

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        commitSave({ value, margin_left: newMl, margin_right: newMr, is_indifferent: false });
      }, 500);
    },
    [readOnly, isIndifferent, marginLeft, marginRight, value, commitSave],
  );

  const handleDropdownChange = useCallback(
    (targetMargin: number) => {
      if (readOnly) return;

      const maxMarginLeft = value + 100;
      const maxMarginRight = 100 - value;
      const safeMargin = Math.min(targetMargin, maxMarginLeft, maxMarginRight);

      setMarginLeft(safeMargin);
      setMarginRight(safeMargin);

      commitSave({ value, margin_left: safeMargin, margin_right: safeMargin, is_indifferent: false });
    },
    [readOnly, value, commitSave],
  );

  const toggleIndifferent = useCallback(() => {
    if (readOnly) return;

    const nextState = !isIndifferent;
    setIsIndifferent(nextState);

    if (nextState) {
      setValue(0);
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const defaultM = isMobile ? 35 : 25;
      setMarginLeft(defaultM);
      setMarginRight(defaultM);

      commitSave({ is_indifferent: true, value: null, margin_left: null, margin_right: null });
    } else {
      if (onDelete) onDelete(axisUuid);
    }
  }, [readOnly, isIndifferent, commitSave, onDelete, axisUuid]);

  const handleCopyFromOther = useCallback(
    (otherData: AnswerData) => {
      if (readOnly) return;

      const newData = {
        value: otherData.value,
        margin_left: otherData.margin_left,
        margin_right: otherData.margin_right,
        is_indifferent: otherData.is_indifferent,
      };

      if (newData.is_indifferent) {
        setIsIndifferent(true);
      } else {
        setIsIndifferent(false);
        setValue(newData.value ?? 0);
        setMarginLeft(newData.margin_left ?? 10);
        setMarginRight(newData.margin_right ?? 10);
      }

      commitSave(newData);
    },
    [readOnly, commitSave],
  );

  const handleReset = useCallback(() => {
    if (readOnly || !onDelete) return;
    onDelete(axisUuid);
  }, [readOnly, onDelete, axisUuid]);

  return {
    state: {
      value,
      marginLeft,
      marginRight,
      isIndifferent,
      isDropdownOpen,
    },
    actions: {
      setIsDropdownOpen,
      handleSliderChange,
      handleCommit,
      handleThumbWheel,
      handleDropdownChange,
      toggleIndifferent,
      handleCopyFromOther,
      handleReset,
    },
  };
}
