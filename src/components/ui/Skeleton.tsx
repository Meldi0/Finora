interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-charcoal/5 animate-pulse-soft rounded-2xl overflow-hidden relative ${className}`}
    >
      <div className="absolute inset-0 animate-shimmer" />
    </div>
  );
}
