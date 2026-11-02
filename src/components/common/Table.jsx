import React from 'react';

/**
 * Reusable Responsive Table Component
 */
export const Table = ({
  columns = [],
  data = [],
  renderRow,
  keyExtractor = (item, index) => item.id || index,
  emptyMessage = 'No records found',
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-gray-100 bg-white ${className}`}>
      <table className="min-w-full divide-y divide-gray-100 text-left">
        <thead className="bg-gray-50/80">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : renderRow ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            data.map((item, index) => (
              <tr key={keyExtractor(item, index)} className="hover:bg-gray-50/60 transition-colors">
                {columns.map((col, cIdx) => (
                  <td
                    key={cIdx}
                    className={`whitespace-nowrap px-4 py-3.5 text-sm text-gray-700 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {col.accessor ? (typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor]) : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
