import React from 'react';

/**
 * Reusable Card Component
 */
export const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  bodyClassName = '',
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden
        ${hoverEffect ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;
