import React from 'react';

export const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={headers.length} 
                className="px-6 py-8 text-center text-gray-500 text-sm"
              >
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  No data found
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr 
                key={item.id || index} 
                className="hover:bg-blue-50 transition-colors duration-150 even:bg-gray-50"
              >
                {renderRow(item, index)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
