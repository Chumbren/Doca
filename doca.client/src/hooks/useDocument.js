import { useState, useCallback } from 'react';
import { api } from '@/api/axios';

export function useDocument(documentId, navigate) {
    const [title, setTitle] = useState('');
    const [versions, setVersions] = useState([]);
    const [currentVersionId, setCurrentVersionId] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadDocument = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/documents/${documentId}`);
            setTitle(res.data.title);
            const allVersions = res.data.versions || [];
            setVersions(allVersions);
            if (allVersions[0]) {
                setCurrentVersionId(allVersions[0].id);
                return allVersions[0].content || '';
            }
            return '';
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            alert('Документ не найден');
            navigate('/');
            return '';
        } finally {
            setLoading(false);
        }
    }, [documentId, navigate]);

    const saveVersion = useCallback(async (content, changeDescription) => {
        await api.post(`/api/documents/${documentId}/versions`, { content, changeDescription });
        return loadDocument(); // возвращает новый контент последней версии
    }, [documentId, loadDocument]);

    const selectVersion = useCallback((version) => {
        setCurrentVersionId(version.id);
        return version.content || '';
    }, []);

    return {
        title,
        versions,
        currentVersionId,
        loading,
        loadDocument,
        saveVersion,
        selectVersion
    };
}