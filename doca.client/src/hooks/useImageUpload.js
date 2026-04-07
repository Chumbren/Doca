import { useState, useRef, useCallback } from 'react';

export function useImageUpload(onInsert) {
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef(null);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    const handleInsert = useCallback((imageData) => {
        onInsert?.(imageData);
        close();
    }, [onInsert, close]);

    return {
        isOpen,
        open,
        close,
        handleInsert,
        fileInputRef
    };
}