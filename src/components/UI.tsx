import React, { type ReactNode } from 'react';
import styles from '../styles/components/_ui.module.scss';
import { clsx } from 'clsx';

interface SyntaxCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  label?: string;
}

export function SyntaxCard({ children, className = "", label, ...rest }: SyntaxCardProps) {
  return (
    <div className={clsx(styles.syntaxCard, className)} {...rest}>
      {label && (
        <div className={styles.syntaxCard__label}>
          <span>#</span> {label}
        </div>
      )}
      {children}
    </div>
  );
}

export function Tag({ children, active, className = "", onClick }: { children: ReactNode, active?: boolean, className?: string, onClick?: () => void }) {
  const cls = clsx(styles.tag, active && styles['tag--active'], onClick && styles['tag--interactive'], className);
  return onClick
    ? <button type="button" className={cls} onClick={onClick}>{children}</button>
    : <span className={cls}>{children}</span>;
}

export function KeyValue({ k, v, className = "" }: { k: string, v: string, className?: string }) {
  return (
    <div className={clsx(styles.keyValue, className)}>
      <span className={styles.keyValue__key}>{k} =</span>
      <span className={styles.keyValue__val}>&quot;{v}&quot;;</span>
    </div>
  );
}
