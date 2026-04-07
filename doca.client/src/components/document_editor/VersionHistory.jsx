export default function VersionHistory({ versions, currentVersionId, onSelectVersion }) {
    return (
        <details className="bg-gray-50 p-3 rounded no-print" open>
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                История версий ({versions.length})
            </summary>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 max-h-40 overflow-y-auto">
                {versions.map(v => (
                    <li
                        key={v.id}
                        className={`flex justify-between border-b pb-1 cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5 transition ${v.id === currentVersionId ? 'bg-blue-50 font-medium text-blue-700' : ''
                            }`}
                        onClick={() => onSelectVersion(v)}
                    >
                        <span>
                            v{v.versionNumber} — {v.changeDescription}
                            {v.id === currentVersionId && <span className="ml-1 text-xs">👈 текущая</span>}
                        </span>
                        <span className="text-xs text-gray-400">
                            {new Date(v.createdAt).toLocaleString('ru-RU')}
                        </span>
                    </li>
                ))}
            </ul>
        </details>
    );
}