import { useNavigate } from 'react-router-dom';

export default function DocumentHeader({ title, onPrint }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="space-x-2 no-print">
                <button onClick={onPrint} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Печать
                </button>
                <button onClick={() => navigate('/')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
                    ← Назад
                </button>
            </div>
        </div>
    );
}