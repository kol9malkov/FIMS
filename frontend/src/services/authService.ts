const API_URL = 'http://localhost:8000'; // TODO: использовать из .env

export interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
  role: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.append('username', username);
  body.append('password', password);

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error('Неверный логин или пароль');
  }

  return response.json();
}
