import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function PageTransition({
  children,
  className = '',
  delay = 0,
}: PageTransitionProps) {
  return (
    <div
      className={`animate-slide-up ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
