// src/components/ui/ToolbarButton.jsx
export default function ToolbarButton({ onClick, active, disabled, children, title }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            aria-pressed={active}
            className={`
        px-2 py-1 rounded text-sm font-medium transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : active
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
      `}
        >
            {children}
        </button>
    );
}