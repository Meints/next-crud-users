'use client';

import React, { useEffect } from 'react';

type WelcomeModalProps = {
  userName: string;
  onClose: () => void;
};

export default function WelcomeModal({ userName, onClose }: WelcomeModalProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Olá, {userName}!</h2>
        <p className="text-gray-700 mb-6">Seja muito bem-vindo ao nosso painel! Estamos felizes em tê-lo conosco.</p>
        <button
          onClick={onClose}
          className="inline-block px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-700 cursor-pointer transition"
          aria-label="Fechar modal de boas-vindas"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
