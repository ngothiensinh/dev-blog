'use client';

import { CopyButton } from '../CopyButton/CopyButton';
import clsx from 'clsx';

export default function Pre({
  children,
  raw,
  buttonClasses = 'absolute top-3 right-3 bg-zinc-700',
  ...props
}) {
  return (
    <pre
      {...props}
      className={clsx('relative overflow-x-auto p-4', props.className)}
    >
      <CopyButton text={raw} className={buttonClasses} />
      {children}
    </pre>
  );
}
