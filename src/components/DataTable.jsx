import React from 'react';
import { Edit2, Trash2, Loader, Eye } from 'lucide-react';

export const DataTable = ({ columns, data, loading, onEdit, onDelete, onView }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-6 h-6 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 font-roboto">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column, index) => (
              <th 
                key={index}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito"
              >
                {column.header}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider font-nunito">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-roboto">
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {onView && (
                    <button
                      onClick={() => onView(row)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(row)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
