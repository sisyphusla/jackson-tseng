import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getColorClass(value: string, isGrowth = false): string {
  const numValue = parseFloat(value.replace('%', ''));
  if (isNaN(numValue)) return '';

  if (isGrowth) {
    if (numValue > 0) {
      if (numValue > 20) return 'text-pink-600 font-bold';
      if (numValue > 15) return 'text-pink-500 font-bold';
      if (numValue > 10) return 'text-pink-400 font-bold';
      if (numValue > 5) return 'text-pink-300 font-bold';
      return 'text-pink-200 font-bold';
    } else if (numValue < 0) {
      if (numValue < -20) return 'text-green-800';
      if (numValue < -15) return 'text-green-700';
      if (numValue < -10) return 'text-green-600';
      if (numValue < -5) return 'text-green-500';
      return 'text-green-400 font-bold';
    }
  } else {
    return numValue > 0
      ? 'text-red-500 font-bold'
      : numValue < 0
      ? 'text-green-500'
      : '';
  }

  return '';
}
