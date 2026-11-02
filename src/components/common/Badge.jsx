import React from 'react';

/**
 * Reusable Badge / Status Pill Component
 */
export const Badge = ({
  children,
  variant = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand'
  size = 'md', // 'sm' | 'md'
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
    info: 'bg-sky-50 text-sky-700 border-sky-200/60',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    brand: 'bg-amber-100 text-amber-900 border-amber-300',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border tracking-wide uppercase
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.neutral}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
