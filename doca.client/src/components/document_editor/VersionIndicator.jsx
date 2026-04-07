export default function VersionIndicator({ versions, currentVersionId, isEditing }) {
    if (!versions.length) return null;

    const current = versions.find(v => v.id === currentVersionId);

    return (
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded inline-block">
            Просмотр: <strong>версия {current?.versionNumber}</strong>
            {!isEditing && <span className="ml-2 text-orange-600">(только чтение)</span>}
        </div>
    );
}