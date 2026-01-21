export type AffinityLevel = {
  labelKey: string;
  colorClass: string;
  icon: string;
  badgeClass: string;
  solidClass: string;
};

export function getAffinityBadgeStyles(val: number): AffinityLevel {
  if (val === 100) {
    return {
      labelKey: 'affinity_identical',
      colorClass: 'text-affinity-identical',
      icon: 'verified',
      badgeClass: 'bg-affinity-identical/10 border-affinity-identical/20 text-affinity-identical border',
      solidClass: 'bg-affinity-identical text-white shadow-affinity-identical/20',
    };
  }
  if (val >= 90) {
    return {
      labelKey: 'affinity_almost_identical',
      colorClass: 'text-affinity-almost-identical',
      icon: 'hotel_class',
      badgeClass: 'bg-affinity-almost-identical/10 border-affinity-almost-identical/20 text-affinity-almost-identical border',
      solidClass: 'bg-affinity-almost-identical text-white shadow-affinity-almost-identical/20',
    };
  }
  if (val >= 80) {
    return {
      labelKey: 'affinity_very_high',
      colorClass: 'text-affinity-very-high',
      icon: 'check_circle',
      badgeClass: 'bg-affinity-very-high/10 border-affinity-very-high/20 text-affinity-very-high border',
      solidClass: 'bg-affinity-very-high text-white shadow-affinity-very-high/20',
    };
  }
  if (val >= 60) {
    return {
      labelKey: 'affinity_high',
      colorClass: 'text-affinity-high',
      icon: 'check',
      badgeClass: 'bg-affinity-high/10 border-affinity-high/20 text-affinity-high border',
      solidClass: 'bg-affinity-high text-white shadow-affinity-high/20',
    };
  }
  if (val >= 45) {
    return {
      labelKey: 'affinity_compatible',
      colorClass: 'text-affinity-compatible',
      icon: 'thumb_up',
      badgeClass: 'bg-affinity-compatible/10 border-affinity-compatible/20 text-affinity-compatible border',
      solidClass: 'bg-affinity-compatible text-white shadow-affinity-compatible/20',
    };
  }
  if (val >= 30) {
    return {
      labelKey: 'affinity_low',
      colorClass: 'text-affinity-low',
      icon: 'warning',
      badgeClass: 'bg-affinity-low/10 border-affinity-low/20 text-affinity-low border',
      solidClass: 'bg-affinity-low text-white shadow-affinity-low/20',
    };
  }
  if (val >= 15) {
    return {
      labelKey: 'affinity_very_low',
      colorClass: 'text-affinity-very-low',
      icon: 'error',
      badgeClass: 'bg-affinity-very-low/10 border-affinity-very-low/20 text-affinity-very-low border',
      solidClass: 'bg-affinity-very-low text-white shadow-affinity-very-low/20',
    };
  }
  if (val > 0) {
    return {
      labelKey: 'affinity_almost_opposite',
      colorClass: 'text-affinity-almost-opposite',
      icon: 'block',
      badgeClass: 'bg-affinity-almost-opposite/10 border-affinity-almost-opposite/20 text-affinity-almost-opposite border',
      solidClass: 'bg-affinity-almost-opposite text-white shadow-affinity-almost-opposite/20',
    };
  }
  return {
    labelKey: 'affinity_opposite',
    colorClass: 'text-affinity-opposite',
    icon: 'cancel',
    badgeClass: 'bg-affinity-opposite/10 border-affinity-opposite/20 text-affinity-opposite border',
    solidClass: 'bg-affinity-opposite text-white shadow-affinity-opposite/20',
  };
}

export const getAffinityLevel = getAffinityBadgeStyles;
