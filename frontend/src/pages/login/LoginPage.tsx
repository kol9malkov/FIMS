import {useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-96 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Вход в систему</h2>

                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Войти
                </button>
            </form>
        </div>
    )
}

export default LoginPage
