'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CreateBlog() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', content: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }
    if (!form.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (form.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
    }
    if (form.image && !isValidUrl(form.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleImageChange = (e) => {
    const imageUrl = e.target.value;
    setForm({ ...form, image: imageUrl });
    if (imageUrl && isValidUrl(imageUrl)) {
      setImagePreview(imageUrl);
    } else {
      setImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/blogs');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Error creating blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = form.content.trim().split(/\s+/).filter(word => word).length;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/blogs" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Blogs
            </Link>
            <div className="h-6 w-px bg-gray-300 mr-4" />
            <h1 className="text-xl font-semibold text-gray-900">Create New Blog Post</h1>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showPreview ? (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {form.title || 'Untitled Post'}
            </h1>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Blog post"
                className="w-full h-64 object-cover rounded-lg mb-6"
                onError={() => setImagePreview('')}
              />
            )}
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {form.content || 'Start writing your blog content...'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title *
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="text-sm font-medium text-gray-700">
                  Content *
                </label>
                <div className="text-sm text-gray-500">
                  {wordCount} words • ~{estimatedReadTime} min read
                </div>
              </div>
              <textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows="12"
                className={`w-full px-4 py-3 border rounded-lg resize-vertical focus:ring-2 focus:ring-blue-500 ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.content}
                </p>
              )}
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-2 block">
                Featured Image
              </label>
              <input
                id="image"
                type="url"
                value={form.image}
                onChange={handleImageChange}
                placeholder="https://example.com/image.jpg"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.image ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.image && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.image}
                </p>
              )}
              {imagePreview && (
                <div className="relative mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                    onError={() => {
                      setImagePreview('');
                      setErrors({ ...errors, image: 'Failed to load image' });
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircleIcon className="w-3 h-3 mr-1" /> Valid
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Link
                href="/blogs"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  'Publish Post'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
