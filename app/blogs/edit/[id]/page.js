// ✅ /app/blogs/edit/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditBlog() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [form, setForm] = useState({ title: '', content: '', image: '' });
  const [originalForm, setOriginalForm] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Blog not found');
      const data = await res.json();
      setForm({
        title: data.title || '',
        content: data.content || '',
        image: data.image || ''
      });
      setOriginalForm({
        title: data.title || '',
        content: data.content || '',
        image: data.image || ''
      });
      if (data.image) setImagePreview(data.image);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch blog');
      router.push('/blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Update failed');
      router.push('/blogs');
    } catch (err) {
      console.error(err);
      alert('Failed to update blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
          className="w-full p-2 border rounded"
          rows={10}
          required
        />
        <input
          type="url"
          placeholder="Image URL (optional)"
          value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })}
          className="w-full p-2 border rounded"
        />
        {imagePreview && <img src={imagePreview} className="w-full h-auto rounded" alt="Preview" />}
        <div className="flex gap-2">
          <Link href="/blogs" className="px-4 py-2 bg-gray-300 rounded">Cancel</Link>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded">
            {isSubmitting ? 'Updating...' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  );
}

