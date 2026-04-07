
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { api } from '@/api/axios';
import { useAuth } from '@/hooks/useAuth';
import EditorToolbar from './EditorToolbar';
import Header from '@/components/ui/Header';
export default function DocumentEditor() {
   
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    // Проверка авторизации
    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
    }, [user, navigate]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [changeDesc, setChangeDesc] = useState('');
    const [versions, setVersions] = useState([]);
    const [currentVersionId, setCurrentVersionId] = useState(null);
    const [isEditing, setIsEditing] = useState(true);
    const [loading, setLoading] = useState(true);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({ inline: false, allowBase64: true }),
            Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
     
            TextAlign.configure({
                types: ['heading', 'paragraph'], 
            }),
        ],
        content: content,
        editable: isEditing,
        onUpdate: ({ editor }) => setContent(editor.getHTML()),
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    useEffect(() => {
        if (editor) editor.setEditable(isEditing);
    }, [isEditing, editor]);

    const loadDocument = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/documents/${id}`);

            setTitle(res.data.title);

            if (res.data.headerImage) {
                localStorage.setItem('templateHeader', res.data.headerImage);
            }
            if (res.data.footerImage) {
                localStorage.setItem('templateFooter', res.data.footerImage);
            }

            const allVersions = res.data.versions || [];
            setVersions(allVersions);

            const latest = allVersions[0];
            if (latest) {
                setContent(latest.content || '');
                setCurrentVersionId(latest.id);
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            alert('Документ не найден');
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        loadDocument();
    }, [loadDocument]);





    const loadVersion = useCallback((version) => {
        setContent(version.content || '');
        setCurrentVersionId(version.id);
        setIsEditing(false);
        setChangeDesc('');
    }, []);

    const editLatest = useCallback(() => {
        const latest = versions[0];
        if (latest) {
            setContent(latest.content || '');
            setCurrentVersionId(latest.id);
            setIsEditing(true);
        }
    }, [versions]);

    const saveVersion = async () => {
        if (!changeDesc.trim()) return alert('Обязательно укажите описание изменений');
        if (!isEditing) return alert('Сначала вернитесь к редактированию последней версии');
        if (!editor) return;

        try {
            await api.post(`/api/documents/${id}/versions`, {
                content: editor.getHTML(),
                changeDescription: changeDesc
            });
            setChangeDesc('');
            await loadDocument();
            setIsEditing(true);
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Не удалось сохранить: ' + (error.response?.data?.message || error.message));
        }
    };

    const printDoc = () => {
        const headerImg = localStorage.getItem('templateHeader') || '';
        const footerImg = localStorage.getItem('templateFooter') || '';
        const author = localStorage.getItem('username') || 'Сотрудник';
        const currentVersion = versions.find(v => v.id === currentVersionId);
        const printWindow = window.open('', '_blank');

        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Times New Roman', serif; line-height: 1.5; margin: 0; padding: 20px; color: #000; }
          .header { text-align: center; margin-bottom: 20px; }
          .header img { max-width: 100%; height: auto; }
          .footer { margin-top: 40px; border-top: 1px solid #888; padding-top: 5px; font-size: 10px; color: #555; text-align: center; }
          .content { min-height: 400px; }
          .content h1 { font-size: 20px; text-align: center; margin: 0 0 15px 0; font-weight: bold; }
          .content h2 { font-size: 18px; margin: 15px 0 10px 0; font-weight: bold; }
          .content h3 { font-size: 16px; margin: 10px 0 8px 0; font-weight: bold; }
          .content p { margin: 0 0 10px 0; }
          .content ul, .content ol { margin: 0 0 10px 20px; padding: 0; }
          .content li { margin: 0 0 5px 0; }
          .content blockquote { border-left: 3px solid #ccc; margin: 10px 0; padding: 5px 15px; color: #555; font-style: italic; }
          .content img { max-width: 100%; height: auto; display: block; margin: 10px auto; }
          .content a { color: #0066cc; text-decoration: none; }
          .content strong { font-weight: bold; }
          .content em { font-style: italic; }
          @media print { .no-print { display: none !important; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <br> <img src="${headerImg}" style="max-height:30px; margin-top:5px;">
        <div class="content">${content}</div>
        <div class="footer">
          Версия: ${currentVersion?.versionNumber || 1} |
          Дата: ${new Date().toLocaleDateString('ru-RU')} |
          Автор: ${author}
          ${footerImg ? `<br><img src="${footerImg}" style="max-height:30px; margin-top:5px;">` : ''}
        </div>
      </body>
      </html>
    `;
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 300);
    };

    if (loading) {
        return <div className="p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[400px] text-gray-500">Загрузка документа...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-4">
          
            <Header
                title={title}
                showPrint={true}
                onPrint={printDoc}
                showBack={true}
                onBack={() => navigate('/dashboard')}  
            />

            {versions.length > 0 && (
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded inline-block">
                    Просмотр: <strong>версия {versions.find(v => v.id === currentVersionId)?.versionNumber}</strong>
                    {!isEditing && <span className="ml-2 text-orange-600">(только чтение)</span>}
                </div>
            )}

            <div className={`border rounded bg-white shadow-sm overflow-hidden ${!isEditing ? 'bg-gray-50' : ''}`}>

                <EditorToolbar editor={editor} isEditing={isEditing} />

                <EditorContent
                    editor={editor}
                    className={`p-4 min-h-[250px] prose max-w-none focus:outline-none ${!isEditing ? 'pointer-events-none bg-gray-50' : ''}`}
                />
            </div>

            {!isEditing && (
                <div className="no-print">
                    <button onClick={editLatest} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">✏️ Редактировать последнюю версию</button>
                </div>
            )}

            {isEditing && (
                <div className="flex gap-2 no-print">
                    <input
                        className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Обязательно опишите изменения..."
                        value={changeDesc}
                        onChange={e => setChangeDesc(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveVersion()}
                    />
                    <button onClick={saveVersion} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium transition whitespace-nowrap">💾 Сохранить версию</button>
                </div>
            )}

            <details className="bg-gray-50 p-3 rounded no-print" open>
                <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">История версий ({versions.length})</summary>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 max-h-40 overflow-y-auto">
                    {versions.map(v => (
                        <li
                            key={v.id}
                            className={`flex justify-between border-b pb-1 cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5 transition ${v.id === currentVersionId ? 'bg-blue-50 font-medium text-blue-700' : ''}`}
                            onClick={() => loadVersion(v)}
                        >
                            <span>v{v.versionNumber} — {v.changeDescription}{v.id === currentVersionId && <span className="ml-1 text-xs">👈 текущая</span>}</span>
                            <span className="text-xs text-gray-400">{new Date(v.createdAt).toLocaleString('ru-RU')}</span>
                        </li>
                    ))}
                </ul>
            </details>
        </div>
    );
}