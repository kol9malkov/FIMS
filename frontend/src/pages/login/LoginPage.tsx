const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Вход</h2>
        <input
          type="text"
          placeholder="Имя пользователя"
          className="w-full p-2 mb-3 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Войти
        </button>
      </form>
    </div>
  )
}

export default LoginPage
