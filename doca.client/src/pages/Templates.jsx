import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/axios';
import Header from '@/components/ui/Header';
export default function Templates() {
    const [templates, setTemplates] = useState([]);
    const [filter, setFilter] = useState('all'); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  

    const loadTemplates = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/templates', {
                params: { mine: filter === 'mine' ? true : null }
            });
            setTemplates(res.data);
        } catch (error) {
            console.error('Ошибка:', error);
        } finally {
            setLoading(false);
        }
    }, [filter]); 

    useEffect(() => {
        loadTemplates();
    }, [loadTemplates]); 

    const deleteTemplate = async (id) => {
        if (!confirm('Удалить этот шаблон? Документы, использующие его, останутся без привязки.')) return;
        try {
            await api.delete(`/api/templates/${id}`);
            loadTemplates();
        } catch (error) {
            alert('Ошибка: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Загрузка...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Header title="Шаблоны документов" />  <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">📋 Шаблоны документов</h1>
                <button
                    onClick={() => navigate('/templates/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    + Создать шаблон
                </button>
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                >
                    Все шаблоны
                </button>
                <button
                    onClick={() => setFilter('mine')}
                    className={`px-3 py-1 rounded text-sm ${filter === 'mine' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                >
                    Мои шаблоны
                </button>
            </div>

            <div className="grid gap-3">
                {templates.map(t => (
                    <div key={t.id} className="p-4 border rounded bg-white shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-lg">{t.name}</h3>
                                    {t.isPublic && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Публичный</span>}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{t.description || 'Без описания'}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Автор: {t.authorName} • Обновлено: {new Date(t.updatedAt).toLocaleString('ru-RU')}
                                </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => navigate(`/templates/${t.id}`)}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => deleteTemplate(t.id)}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {templates.length === 0 && (
                    <p className="text-gray-500 text-center py-8 bg-gray-50 rounded">
                        {filter === 'mine' ? 'У вас пока нет шаблонов' : 'Шаблонов не найдено'}
                    </p>
                )}
            </div>
        </div>
    );
}