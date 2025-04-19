// Design System - Tailwind CSS Classes

// Layout
export const layout = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-6',
  grid: {
    base: 'grid gap-6',
    cols2: 'grid-cols-1 md:grid-cols-2',
    cols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  },
  flex: {
    base: 'flex',
    col: 'flex-col',
    row: 'flex-row',
    center: 'items-center justify-center',
    between: 'items-center justify-between',
    start: 'items-start',
    end: 'items-end',
  }
};

// Cards
export const card = {
  base: 'bg-white rounded-xl shadow-sm overflow-hidden',
  header: 'p-6 border-b border-gray-200',
  body: 'p-6',
  footer: 'p-6 border-t border-gray-200',
  hover: 'hover:shadow-md transition-shadow duration-200',
  interactive: 'cursor-pointer hover:border-blue-500 transition-colors duration-200',
};

// Typography
export const typography = {
  h1: 'text-2xl font-bold text-gray-900',
  h2: 'text-xl font-semibold text-gray-900',
  h3: 'text-lg font-medium text-gray-900',
  h4: 'text-base font-medium text-gray-900',
  body: 'text-base text-gray-600',
  small: 'text-sm text-gray-500',
  tiny: 'text-xs text-gray-500',
};

// Buttons
export const button = {
  base: 'inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  icon: 'p-2 rounded-full hover:bg-gray-100 transition-colors duration-200',
};

// Badges
export const badge = {
  base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800',
};

// Forms
export const form = {
  input: 'block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  select: 'block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
  checkbox: 'rounded border-gray-300 text-blue-600 focus:ring-blue-500',
};

// Spacing
export const spacing = {
  section: 'space-y-6',
  stack: 'space-y-4',
  inline: 'space-x-4',
  grid: 'gap-4',
};

// Colors
export const colors = {
  primary: {
    light: 'bg-blue-50 text-blue-700',
    base: 'bg-blue-600 text-white',
    dark: 'bg-blue-700 text-white',
  },
  success: {
    light: 'bg-green-50 text-green-700',
    base: 'bg-green-600 text-white',
    dark: 'bg-green-700 text-white',
  },
  warning: {
    light: 'bg-yellow-50 text-yellow-700',
    base: 'bg-yellow-600 text-white',
    dark: 'bg-yellow-700 text-white',
  },
  danger: {
    light: 'bg-red-50 text-red-700',
    base: 'bg-red-600 text-white',
    dark: 'bg-red-700 text-white',
  },
};

// Transitions
export const transitions = {
  base: 'transition-all duration-200',
  fast: 'transition-all duration-150',
  slow: 'transition-all duration-300',
};

// Shadows
export const shadows = {
  sm: 'shadow-sm',
  base: 'shadow',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
};

// Z-index
export const zIndex = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  fixed: 'z-30',
  modal: 'z-40',
  popover: 'z-50',
  tooltip: 'z-60',
}; 