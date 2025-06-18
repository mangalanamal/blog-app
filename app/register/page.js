// import Link from "next/link"

// export default function page() {
//   return (
//     <div>
//         <h1>This is Register</h1>
//         <Link href="/">Home</Link>
//     </div>
//   )
// }

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        localStorage.setItem('token', data.token);
        router.push('/');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="username" onChange={handleChange} value={form.username} placeholder="Username" required className="w-full p-2 border rounded" />
        <input type="email" name="email" onChange={handleChange} value={form.email} placeholder="Email" required className="w-full p-2 border rounded" />
        <input type="password" name="password" onChange={handleChange} value={form.password} placeholder="Password" required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
      </form>
    </main>
  );
}
