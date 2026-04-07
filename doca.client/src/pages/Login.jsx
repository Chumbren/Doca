import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(form.username, form.email, form.password);
        await login(form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка авторизации');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80 space-y-3">
        <h2 className="text-xl font-bold text-center">{isRegister ? 'Регистрация' : 'Вход'}</h2>
        {isRegister && (
          <input className="w-full p-2 border rounded" placeholder="Имя пользователя" 
            value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
        )}
        <input className="w-full p-2 border rounded" type="email" placeholder="Email" 
          value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input className="w-full p-2 border rounded" type="password" placeholder="Пароль" 
          value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
        <button type="button" className="w-full text-sm text-blue-600 hover:underline" 
          onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Регистрация'}
        </button>
      </form>
    </div>
  );
}