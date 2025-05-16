import React, {useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
    const {login} = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            await login(username, password)
            // редирект произойдёт внутри AuthContext → login()
        } catch {
            setError('Неверное имя пользователя или пароль')
        }
    }

    return (
        <div
            className="d-flex align-items-center justify-content-center min-vh-100"
            style={{
                background: 'linear-gradient(to bottom right, #e6ecf3, #cfd9e9)',
                padding: '1rem',
            }}
        >
            <div
                className="card shadow-sm p-4 rounded-4 animate-fade-slide"
                style={{width: '100%', maxWidth: '400px'}}
            >
                <h2 className="text-center mb-4 fw-bold">Вход в систему</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Введите имя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Пароль
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-danger small text-center mb-3">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100">
                        Войти
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
