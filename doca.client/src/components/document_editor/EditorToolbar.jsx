// src/components/document-editor/EditorToolbar.jsx
import { useRef } from 'react';
import ToolbarButton from '../ui/ToolbarButton';

const Separator = () => <span className="inline-block w-px h-6 bg-gray-400 mx-2 self-center" aria-hidden="true" />;

export default function EditorToolbar({ editor, isEditing }) {
    const fileInputRef = useRef(null);

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        if (!file.type.startsWith('image/')) {
            return alert('Пожалуйста, выберите файл изображения');
        }
        if (file.size > 5 * 1024 * 1024) {
            return alert('Файл слишком большой (макс. 5 МБ)');
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result;
            if (base64) {
                editor.chain().focus().setImage({ src: base64, alt: file.name }).run();
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const triggerFileDialog = () => {
        fileInputRef.current?.click();
    };

    if (!editor || !isEditing) return null;

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">

            {/* 🔒 Скрытый input для файлов */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
            />

            {/* 📑 Заголовки */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Заголовок 1"><strong>H1</strong></ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Заголовок 2">H2</ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Заголовок 3">H3</ToolbarButton>

            <Separator />

            {/* ✍️ Форматирование */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Жирный (Ctrl+B)"><strong>Ж</strong></ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Курсив (Ctrl+I)"><em>К</em></ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Подчёркнутый (Ctrl+U)"><u>П</u></ToolbarButton>

            <Separator />

            {/* 📋 Списки */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Маркированный список">•••</ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Нумерованный список">123</ToolbarButton>

            <Separator />

            {/* 📐 Выравнивание */}
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="По левому">⬅</ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="По центру">⬌</ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="По правому">➡</ToolbarButton>

            <Separator />

            {/* 🔗 Вставка */}
            <ToolbarButton onClick={triggerFileDialog} title="Вставить изображение с компьютера">🖼</ToolbarButton>
            <ToolbarButton onClick={() => { const url = prompt('URL:'); if (url) editor.chain().focus().setLink({ href: url }).run(); }} active={editor.isActive('link')} title="Ссылка">🔗</ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} title="Убрать ссылку">✂️</ToolbarButton>

            <Separator />

            {/* 🧹 Очистка */}
            <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Сбросить форматирование">🧹</ToolbarButton>
        </div>
    );
}