export default function LoadingSpinner({ message = 'Загрузка...' }) {
    return (
        <div className="p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[400px] text-gray-500">
            <div className="animate-pulse">{message}</div>
        </div>
    );
}