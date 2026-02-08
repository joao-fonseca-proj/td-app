import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const CATEGORIES = [
  { name: 'Health', keywords: ['gym', 'run', 'doctor', 'meds', 'workout', 'yoga'], color: 'bg-green-100 text-green-700' },
  { name: 'Finance', keywords: ['pay', 'bill', 'bank', 'money', 'buy', 'transfer'], color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Social', keywords: ['call', 'meet', 'party', 'dinner', 'mom', 'dad', 'date'], color: 'bg-purple-100 text-purple-700' },
  { name: 'Work', keywords: ['email', 'report', 'meeting', 'slack', 'boss', 'code', 'deploy'], color: 'bg-blue-100 text-blue-700' },
];

export const analyzeTask = (text) => {
  let cleanText = text;
  let isUrgent = false;
  let category = 'General';

  if (cleanText.toLowerCase().includes('urgent')) {
    isUrgent = true;
    cleanText = cleanText.replace(/urgent/gi, '').trim(); 
  }

  return { text: cleanText, isUrgent, category };
};

export const getDayLabels = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  // Format: "Sat, Feb 7"
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const dateString = date.toLocaleDateString('en-US', options);

  if (offset === 0) return { title: 'Today', label: dateString };
  if (offset === 1) return { title: 'Tomorrow', label: dateString };
  if (offset === -1) return { title: 'Yesterday', label: dateString };
  
  if (offset > 1) return { title: `+${offset} Days`, label: dateString };
  if (offset < -1) return { title: `${Math.abs(offset)} Days Ago`, label: dateString };
};

/**
 * Calculates the offset in days from today.
 * e.g. If today is Feb 8 and dateString is Feb 7, returns -1.
 */
export const calculateOffsetFromDate = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate - today;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * The reverse: converts an offset (0, 1) into YYYY-MM-DD for the BE.
 */
export const getDateStringFromOffset = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

