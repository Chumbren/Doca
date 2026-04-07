// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/api/axios';
import Header from '@/components/ui/Header'; // 👈 Импорт

export default function Dashboard() {
    const [docs, setDocs] = useState([]);
    const [title, setTitle] = useState('');
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [docsRes, tplRes] = await Promise.all([
                    api.get('/api/documents'),
                    api.get('/api/templates')
                ]);
                setDocs(docsRes.data);
                setTemplates(tplRes.data);
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
            }
        };
        fetchData();
    }, []);

    const createDoc = async () => {
        if (!title.trim()) return alert('Введите название');
        try {
            const payload = {
                title,
                initialContent: '',
                templateId: selectedTemplate ? Number(selectedTemplate) : null
            };
            const res = await api.post('/api/documents', payload);

            if (res.data.headerImage) localStorage.setItem('templateHeader', res.data.headerImage);
            if (res.data.footerImage) localStorage.setItem('templateFooter', res.data.footerImage);

            navigate(`/docs/${res.data.id}`);
        } catch (error) {
            alert('Ошибка: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* 👇 Используем Header с заголовком */}
            <Header title="📁 Документы отдела" />

            <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <input
                    className="flex-1 p-2 border rounded"
                    placeholder="Название нового документа"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <select
                    className="p-2 border rounded"
                    value={selectedTemplate}
                    onChange={e => setSelectedTemplate(e.target.value)}
                >
                    <option value="">Без шаблона</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <button
                    onClick={createDoc}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Создать
                </button>
            </div>

            <div className="grid gap-3">
                {docs.map(d => (
                    <Link key={d.id} to={`/docs/${d.id}`} className="block p-4 border rounded hover:bg-gray-50 transition">
                        <div className="font-medium">{d.title}</div>
                        <div className="text-sm text-gray-500">Обновлено: {new Date(d.updatedAt).toLocaleString()}</div>
                    </Link>
                ))}
                {docs.length === 0 && <p className="text-gray-500 text-center py-4">Документов пока нет</p>}
            </div>
        </div>
    );
}