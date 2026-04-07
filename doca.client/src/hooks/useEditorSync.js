import { useEffect } from 'react';

export function useEditorSync(editor, content, isEditing) {
    // Синхронизация контента при переключении версий
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    // Переключение режима редактирования
    useEffect(() => {
        if (editor) {
            editor.setEditable(isEditing);
        }
    }, [isEditing, editor]);
}