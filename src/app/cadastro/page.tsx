'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { EyeOff, EyeIcon } from 'lucide-react';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.email('Email inválido'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .regex(/[a-zA-Z]/, 'A senha deve conter letras')
    .regex(/\d/, 'A senha deve conter números'),
  cep: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{8}$/.test(val), 'CEP deve ter 8 números'),
  state: z.string().optional(),
  city: z.string().optional(),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const cep = watch('cep');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function fetchAddress() {
      if (!cep || cep.length !== 8) {
        setValue('state', '');
        setValue('city', '');
        return;
      }

      setLoadingAddress(true);
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.data.erro) {
          setValue('state', '');
          setValue('city', '');
          setErrorMessage('CEP não encontrado.');
        } else {
          setValue('state', response.data.uf || '');
          setValue('city', response.data.localidade || '');
          setErrorMessage(null);
        }
      } catch {
        setValue('state', '');
        setValue('city', '');
        setErrorMessage('Erro ao buscar endereço pelo CEP.');
      } finally {
        setLoadingAddress(false);
      }
    }
    fetchAddress();
  }, [cep, setValue]);

  const onSubmit = async (data: RegisterFormInputs) => {
    setErrorMessage(null);

      if (data.cep === '') delete data.cep;
      if (data.city === '') delete data.city;
      if (data.state === '') delete data.state;

    try {
      await axios.post('http://localhost:3000/api/register', data);
      router.push('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        setErrorMessage(axiosError.response?.data?.message || 'Erro ao cadastrar. Tente novamente.');
      } else {
        setErrorMessage('Erro inesperado. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Cadastro</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label htmlFor="name" className="block mb-1 text-sm text-indigo-600">
            Nome <span className='text-red-500 font-bold'>*</span>
          </label>
          <input
            id="name"
            type="text"
            className={`w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-1 ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-300'
            }`}
            {...register('name')}
          />
          {errors.name && <p className="text-red-600 text-sm mb-2">{errors.name.message}</p>}

          <label htmlFor="email" className="block mb-1 text-sm text-indigo-600">
            Email <span className='text-red-500 font-bold'>*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-1 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-300'
            }`}
            {...register('email')}
          />
          {errors.email && <p className="text-red-600 text-sm mb-2">{errors.email.message}</p>}

          <label htmlFor="password" className="block mb-1 text-sm text-indigo-600">
            Senha <span className='text-red-500 font-bold'>*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-1 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-300'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-2 p-1 text-indigo-600 hover:bg-indigo-100 rounded"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password.message}</p>}

          <label htmlFor="cep" className="block mb-1 text-sm text-indigo-600">
            CEP <span className='text-gray-500 text-xs font-light'>(opcional)</span>
          </label>
          <input
            id="cep"
            type="text"
            maxLength={8}
            inputMode='numeric'
            placeholder="00000000"
            pattern='[0-9]{8}'
            className={`w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-1 ${
              errors.cep ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-300'
            }`}
            {...register('cep')}
          />
          {errors.cep && <p className="text-red-600 text-sm mb-2">{errors.cep.message}</p>}

          <label htmlFor="state" className="block mb-1 text-sm text-indigo-600">
            Estado
          </label>
          <input
            id="state"
            type="text"
            readOnly
            disabled={loadingAddress}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 bg-gray-200 cursor-not-allowed"
            {...register('state')}
          />

          <label htmlFor="city" className="block mb-1 text-sm text-indigo-600">
            Cidade
          </label>
          <input
            id="city"
            type="text"
            readOnly
            disabled={loadingAddress}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 bg-gray-200 cursor-not-allowed"
            {...register('city')}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        {errorMessage && <p className="text-red-600 mt-4 text-center">{errorMessage}</p>}

        <div className="mt-4 text-center">
            <Link
                href="/login"
                className="text-indigo-600 hover:underline text-sm"
            >
                Já tem uma conta? Faça login
            </Link>
        </div>
      </div>
    </div>
  );
}
