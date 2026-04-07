export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                onClick={e => e.stopPropagation()}
            >
                {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
                {children}
            </div>
        </div>
    );
}