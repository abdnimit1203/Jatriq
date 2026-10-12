import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  badge,
  centered = false,
  className = '',
}) => {
  return (
    <div className={`mb-10 lg:mb-14 ${centered ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'} ${className}`}>
      {badge && (
        <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 mb-2.5 block font-mono">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3.5 text-base sm:text-lg text-stone-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
