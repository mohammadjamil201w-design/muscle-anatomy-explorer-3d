import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../utils/classNames';
export default function Button({children,className,...props}:PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>){return <button className={cn('rounded-xl bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50',className)} {...props}>{children}</button>}
