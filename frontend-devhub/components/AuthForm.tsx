// components/AuthForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../utils/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth
} from 'firebase/auth';

type FormData = {
  email: string;
  password: string;
};

export default function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === 'register') {
        const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const idToken = await userCred.user.getIdToken();

        const user = userCred.user;
        const userData = {
          id: user.uid,
          name: user.displayName ?? 'New User',
          email: user.email,
          password: data.password,
          image: user.photoURL ?? 'https://example.com/default.png',
          role: 'user',
          createdAt: new Date(),
          lastLogin: new Date(),
        };
      
        await fetch('http://localhost:3001/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(userData),
        });
        return;
      }
  
      // login mode
      const userCred = await signInWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await userCred.user.getIdToken();
  
      // obtener profile
      const res = await fetch('http://localhost:3001/users/me', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
  
      const profile = await res.json();
      console.log('Profile:', profile);
  
  
    } catch (error: any) {
      console.error('Auth error:', error.message);
    }
  };
  

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          {...register('email', { required: true })}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
          className="w-full px-3 py-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="mt-4 text-blue-500"
      >
        {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </div>
  );
}
