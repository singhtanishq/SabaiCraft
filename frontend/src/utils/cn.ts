import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Register the project's custom fontSize tokens so tailwind-merge treats
// e.g. `text-body-lg` as a font-size (not a text color) — otherwise merging
// `text-cream-50` with `text-body-lg` drops the color class and renders
// dark-on-dark buttons.
const customFontSizes = [
  'display-xl',
  'display-lg',
  'display-md',
  'display-sm',
  'heading-xl',
  'heading-lg',
  'heading-md',
  'heading-sm',
  'body-lg',
  'body',
  'body-sm',
  'caption',
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: customFontSizes }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
