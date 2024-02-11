'use client';

import { useState } from 'react';
import clsx from 'clsx';
import {
  ClipboardCheckIcon,
  ClipboardIcon,
} from '@/components/CopyButton/icons';

const buttonClasses =
  'flex items-center text-xs font-medium text-primary-500 hover:text-primary-600 p-2 rounded-md';

export function CopyButton({ text, className }) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2500);
  };

  const Icon = isCopied ? ClipboardCheckIcon : ClipboardIcon;

  return (
    <button
      disabled={isCopied}
      onClick={copy}
      className={clsx(buttonClasses, className)}
    >
      <Icon className='mr-1 h-4 w-4' />
      <span>{isCopied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}
