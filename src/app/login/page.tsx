'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const response = await axios.post('/api/login', data);

            if (response.status === 200) {
                router.push('/')
            }
        } catch {

        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
            <div className='max-w-md w-full bg-white p-8 rounded-lg shadow-md'>
                <h1 className='text-2xl font-bold mb-6 text-center text-black'>Login</h1>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <label htmlFor="email" className='block mb-1 text-sm text-indigo-600'>
                        Email
                    </label>
                    <input 
                        id="email"
                        type="email" 
                        className={`w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-1 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-300'}`}
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mb-2">{errors.email.message}</p>
                    )}

                    <label htmlFor="password" className='block mb-1 text-sm text-indigo-600'>
                        Senha
                    </label>
                    <input 
                        id="password"
                        type="password" 
                        className={`w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-1 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-300'}`}
                        {...register('password')}
                    />
                    {errors.password && (
                        <p className="text-red-600 text-sm mb-2">{errors.password.message}</p>
                    )}

                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </button>

                </form>

                <div className="mt-4 text-center">
                    <Link
                        href="/cadastro"
                        className="text-indigo-600 hover:underline text-sm"
                    >
                        Ainda não tem cadastro? Clique aqui
                    </Link>
                </div>
                
            </div>
        </div>
    )
}