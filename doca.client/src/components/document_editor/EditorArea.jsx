import { EditorContent } from '@tiptap/react';

export default function EditorArea({ editor, isEditing }) {
    return (
        <div className={`border rounded bg-white shadow-sm overflow-hidden ${!isEditing ? 'bg-gray-50' : ''}`}>
            <EditorContent
                editor={editor}
                className={`p-4 min-h-[250px] prose max-w-none ${!isEditing ? 'pointer-events-none bg-gray-50' : ''}`}
            />
        </div>
    );
}