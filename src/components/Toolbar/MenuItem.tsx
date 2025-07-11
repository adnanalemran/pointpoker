import React from 'react';

export const MenuItem = ({
  icon,
  label,
  onClick,
  testId,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  testId?: string;
}) => {
  return (
    <button
      className='w-full text-left flex items-center p-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0'
      onClick={onClick}
      data-testid={testId}
    >
      <div className='pr-3 text-blue-600 dark:text-blue-400'>{icon}</div>
      <div className='text-sm font-medium text-gray-700 dark:text-gray-300'> {label}</div>
    </button>
  );
};
