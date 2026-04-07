export default function SaveForm({ changeDesc, onChange, onSave, isEditing }) {
    if (!isEditing) return null;

    return (
        <div className="flex gap-2 no-print">
            <input
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Обязательно опишите изменения..."
                value={changeDesc}
                onChange={onChange}
                onKeyDown={e => e.key === 'Enter' && onSave()}
            />
            <button onClick={onSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium transition whitespace-nowrap">
                💾 Сохранить версию
            </button>
        </div>
    );
}