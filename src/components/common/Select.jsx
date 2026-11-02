import React from 'react';

/**
 * Reusable Select Dropdown Component
 */
export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full rounded-lg text-sm px-3.5 py-2.5 outline-none transition-all duration-200 border bg-white
          ${error ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 text-gray-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-100'}
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export default Select;
