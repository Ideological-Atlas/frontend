export type AffinityLevel = {
  labelKey: string;
  colorClass: string;
  icon: string;
  colorHex?: string; // Para gráficos SVG
};

export function getAffinityLevel(val: number): AffinityLevel {
  if (val === 100) {
    return {
      labelKey: 'affinity_identical',
      colorClass: 'text-emerald-600',
      colorHex: '#059669',
      icon: 'verified',
    };
  }
  if (val >= 90) {
    return {
      labelKey: 'affinity_almost_identical',
      colorClass: 'text-emerald-500',
      colorHex: '#10b981',
      icon: 'hotel_class',
    };
  }
  if (val >= 80) {
    return {
      labelKey: 'affinity_very_high',
      colorClass: 'text-green-500',
      colorHex: '#22c55e',
      icon: 'check_circle',
    };
  }
  if (val >= 60) {
    return {
      labelKey: 'affinity_high',
      colorClass: 'text-teal-500',
      colorHex: '#14b8a6',
      icon: 'check',
    };
  }
  if (val >= 45) {
    return {
      labelKey: 'affinity_compatible',
      colorClass: 'text-blue-500',
      colorHex: '#3b82f6',
      icon: 'thumb_up',
    };
  }
  if (val >= 30) {
    return {
      labelKey: 'affinity_low',
      colorClass: 'text-orange-500',
      colorHex: '#f97316',
      icon: 'warning',
    };
  }
  if (val >= 15) {
    return {
      labelKey: 'affinity_very_low',
      colorClass: 'text-red-400',
      colorHex: '#f87171',
      icon: 'error',
    };
  }
  if (val > 0) {
    return {
      labelKey: 'affinity_almost_opposite',
      colorClass: 'text-red-500',
      colorHex: '#ef4444',
      icon: 'block',
    };
  }
  // 0%
  return {
    labelKey: 'affinity_opposite',
    colorClass: 'text-red-600',
    colorHex: '#dc2626',
    icon: 'cancel',
  };
}

// Helpers para clases de Tailwind compuestas (fondos, bordes)
export function getAffinityBadgeStyles(val: number) {
  const level = getAffinityLevel(val);
  // Mapeamos la clase de texto base a variantes de fondo/borde
  // Esto asume que level.colorClass es algo como "text-color-500"
  const baseColor = level.colorClass.replace('text-', '');

  return {
    ...level,
    badgeClass: `bg-${baseColor}/10 border-${baseColor}/20 ${level.colorClass}`,
    bgClass: `bg-${baseColor}`,
    solidClass: `bg-${baseColor} text-white shadow-${baseColor}/20`,
  };
}
