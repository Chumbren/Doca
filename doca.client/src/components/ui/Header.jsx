// src/components/ui/Header.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth';

export default function Header({
    title,
    showBack = true,
    showPrint = false,
    onPrint,
    onBack
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const isDashboard = location.pathname === '/';

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (isDashboard) {
            logout();
            navigate('/login', { replace: true });
        } else {
            navigate(-1);
        }
    };

    const handlePrint = () => {
        if (onPrint) {
            onPrint();
        }
    };

    return (
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="space-x-2">
                {showPrint && (
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        🖨 Печать
                    </button>
                )}
                {showBack && (
                    <button
                        onClick={handleBack}
                        className="text-gray-600 hover:text-gray-900 hover:underline transition px-3 py-2 rounded"
                    >
                        {onBack ? '← Назад' : (isDashboard ? '🚪 Выйти' : '← Назад')}
                    </button>
                )}
            </div>
        </div>
    );
}