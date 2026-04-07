import { useRef, useState } from 'react';
import Modal from '../ui/Modal';

export default function ImageUploadModal({ isOpen, onClose, onInsert }) {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [alt, setAlt] = useState('');
    const [width, setWidth] = useState('');
    const [align, setAlign] = useState('center');

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file?.type.startsWith('image/')) return alert('Выберите изображение');
        if (file.size > 5 * 1024 * 1024) return alert('Макс. размер 5 МБ');

        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target?.result);
        reader.readAsDataURL(file);
    };

    const handleInsert = () => {
        if (!preview) return;
        onInsert({ src: preview, alt: alt || 'Изображение', width: width ? `${width}%` : undefined, align });
        reset();
        onClose();
    };

    const reset = () => {
        setPreview(null); setAlt(''); setWidth(''); setAlign('center');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleClose = () => { reset(); onClose(); };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="🖼 Вставить изображение">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Файл с компьютера</label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="block w-full text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Макс. 5 МБ. Сохраняется как base64.</p>
                </div>

                {preview && (
                    <div className="p-3 bg-gray-50 rounded border">
                        <p className="text-sm font-medium mb-2">Предпросмотр:</p>
                        <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded" />
                    </div>
                )}

                <div className="space-y-3">
                    <input type="text" placeholder="Описание (alt)" value={alt} onChange={e => setAlt(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="number" min="10" max="100" placeholder="Ширина %" value={width} onChange={e => setWidth(e.target.value)} className="w-full p-2 border rounded" />
                    <div className="flex gap-2">
                        {['left', 'center', 'right'].map(a => (
                            <button key={a} type="button" onClick={() => setAlign(a)} className={`flex-1 py-2 rounded border text-sm ${align === a ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`}>
                                {a === 'left' ? '⬅' : a === 'center' ? '⬌' : '➡'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={handleClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Отмена</button>
                    <button onClick={handleInsert} disabled={!preview} className={`px-4 py-2 rounded ${preview ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Вставить</button>
                </div>
            </div>
        </Modal>
    );
}