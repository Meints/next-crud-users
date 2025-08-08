'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

interface User {
  role: 'ADMIN' | 'USER';
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get('http://localhost:3000/api/users/me');
        setUser(response.data);
      } catch (error) {
        console.error('Erro na requisição:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return <p>Usuário não autenticado.</p>;
  }

  return (
    <main style={{ padding: '2rem' }}>
      {user.role === 'ADMIN' ? (
        <>
          <h1>Dashboard Admin</h1>
          <p>Bem-vindo ao painel do administrador.</p>
        </>
      ) : (
        <>
          <h1>Dashboard Usuário</h1>
          <p>Bem-vindo ao painel do usuário comum.</p>
        </>
      )}
    </main>
  );
}
