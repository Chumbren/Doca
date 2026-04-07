import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { api } from '@/api/axios';
import EditorToolbar from '../document_editor/EditorToolbar';

export default function TemplateEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [headerImage, setHeaderImage] = useState('');
    const [footerImage, setFooterImage] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ✅ Стабильный массив расширений
    const extensions = useMemo(() => [
        StarterKit,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Image.configure({ inline: false, allowBase64: true }),
        Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
    ], []);

    const editor = useEditor({
        extensions,
        content: content,
        onUpdate: ({ editor }) => setContent(editor.getHTML()),
        editorProps: { attributes: { class: 'focus:outline-none min-h-[300px]' } },
        immediatelyRender: false, // 👈 предотвращает ранний рендер
    });

    // ✅ Безопасная синхронизация контента
    useEffect(() => {
        if (!editor?.isInitialized) return;
        if (!isEdit) return; // для новых шаблонов контент пустой — не синхронизируем

        const editorContent = editor.getHTML();
        if (content && content !== editorContent) {
            editor.commands.setContent(content);
        }
    }, [content, editor, isEdit]);

    const loadTemplate = useCallback(async () => {
        try {
            const res = await api.get(`/api/templates/${id}`);
            setName(res.data.name);
            setDescription(res.data.description);
            setContent(res.data.content);
            setHeaderImage(res.data.headerImage || '');
            setFooterImage(res.data.footerImage || '');
            setIsPublic(res.data.isPublic);
        } catch (error) {
            alert(`Шаблон не найден\nОшибка: ${error.message || error}`);
            navigate('/templates');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (isEdit) {
            loadTemplate();
        } else {
            setLoading(false); // для нового шаблона сразу снимаем загрузку
        }
    }, [isEdit, loadTemplate]);

    const saveTemplate = async () => {
        if (!name.trim()) return alert('Введите название шаблона');
        if (!editor) return;

        setSaving(true);
        try {
            const payload = {
                name,
                description,
                content: editor.getHTML(),
                headerImage,
                footerImage,
                isPublic
            };

            if (isEdit) {
                await api.put(`/api/templates/${id}`, payload);
                alert('✅ Шаблон обновлён');
            } else {
                const res = await api.post('/api/templates', payload);
                navigate(`/templates/${res.data.id}`);
                return;
            }
        } catch (error) {
            alert('Ошибка: ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Загрузка...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-4">
            <Header title={isEdit ? '✏️ Редактирование шаблона' : '🆕 Новый шаблон'} />   <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{isEdit ? '✏️ Редактирование шаблона' : '🆕 Новый шаблон'}</h1>
                <button onClick={() => navigate('/templates')} className="text-gray-600 hover:underline">← Назад</button>
            </div>

            {/* Метаданные */}
            <div className="space-y-3 p-4 border rounded bg-white">
                <div>
                    <label className="block text-sm font-medium mb-1">Название *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Например: Письмо, Приказ, Отчёт..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Описание</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="Краткое описание шаблона..."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={e => setIsPublic(e.target.checked)}
                        className="rounded border-gray-300"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700">🌐 Доступен всем пользователям</label>
                </div>
            </div>

            {/* Шапка/подвал */}
            <div className="p-4 border rounded bg-white space-y-3">
                <h3 className="font-medium">🎨 Фирменный бланк</h3>
                <div>
                    <label className="block text-sm font-medium mb-1">Изображение шапки (base64 или URL)</label>
                    <input
                        type="text"
                        value={headerImage}
                        onChange={e => setHeaderImage(e.target.value)}
                        className="w-full p-2 border rounded text-sm font-mono"
                        placeholder="data:image/png;base64,... или https://..."
                    />
                    {headerImage && <img src={headerImage} alt="Preview" className="max-h-20 mt-2 rounded" />}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Изображение подвала</label>
                    <input
                        type="text"
                        value={footerImage}
                        onChange={e => setFooterImage(e.target.value)}
                        className="w-full p-2 border rounded text-sm font-mono"
                        placeholder="data:image/png;base64,... или https://..."
                    />
                    {footerImage && <img src={footerImage} alt="Preview" className="max-h-20 mt-2 rounded" />}
                </div>
            </div>

            {/* Редактор */}
            <div className="border rounded bg-white shadow-sm">
                <EditorToolbar editor={editor} isEditing={true} />
                <EditorContent editor={editor} className="p-4 min-h-[300px] prose max-w-none" />
            </div>

            {/* Кнопки */}
            <div className="flex gap-2">
                <button
                    onClick={saveTemplate}
                    disabled={saving}
                    className={`px-4 py-2 rounded font-medium transition ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                >
                    {saving ? '⏳ Сохранение...' : '💾 Сохранить шаблон'}
                </button>
                <button
                    onClick={() => navigate('/templates')}
                    className="px-4 py-2 rounded border hover:bg-gray-50 transition"
                >
                    Отмена
                </button>
            </div>
        </div>
    );
}