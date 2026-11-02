import React from 'react';

/**
 * Reusable Loading Spinner Component
 */
export const LoadingSpinner = ({
  size = 'md', // 'sm' | 'md' | 'lg'
  color = 'border-amber-600',
  text,
  fullPage = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeMap[size] || sizeMap.md} ${color} border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-sm font-medium text-gray-500">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-8">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
