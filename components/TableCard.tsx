
import React from 'react';
import type { TableRow } from '../types';
import { Card } from './Card';

interface TableCardProps {
  title: string;
  data: TableRow[];
}

export const TableCard: React.FC<TableCardProps> = ({ title, data }) => {
  if (!data || data.length === 0) {
    return (
      <Card title={title}>
        <p>No data available.</p>
      </Card>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    <Card title={title} className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {headers.map(header => (
              <th key={header} className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              {headers.map(header => (
                <td key={`${rowIndex}-${header}`} className="px-4 py-3 font-mono">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
