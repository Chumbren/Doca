// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import DocumentEditor from "@/components/document_editor/DocumentEditor";
import TemplateEditor from "@/components/template_editor/TemplateEditor";
import Templates from '@/pages/Templates';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/" />;
};

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/templates" element={<Templates />} />
                <Route path="/templates/new" element={<TemplateEditor />} />
                <Route path="/templates/:id" element={<TemplateEditor />} />
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/docs/:id" element={<ProtectedRoute><DocumentEditor /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AuthProvider>
    );
}