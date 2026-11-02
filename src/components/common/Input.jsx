import React from 'react';

/**
 * Reusable Form Input Component
 */
export const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full rounded-lg text-sm transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5
            border
            ${error ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 bg-white text-gray-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-100'}
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

export default Input;
