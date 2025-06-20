'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  PhotoIcon,
  EyeIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function EditBlog({ params }) {
  const router = useRouter();
  const { id } = params;
  const [form, setForm] = useState({ 
    title: '', 
    content: '', 
    image: '',
    status: 'draft',
    tags: ''
  });
  const [originalForm, setOriginalForm] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [blogMeta, setBlogMeta] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  useEffect(() => {
    // Check for unsaved changes
    const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);
    setHasUnsavedChanges(hasChanges);
  }, [form, originalForm]);

  useEffect(() => {
    // Handle browser back/refresh with unsaved changes
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/blogs/${id}`);
      if (!res.ok) {
        throw new Error('Blog not found');
      }
      const data = await res.json();
      
      const blogData = {
        title: data.title || '',
        content: data.content || '',
        image: data.image || '',
        status: data.status || 'draft',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || '')
      };
      
      setForm(blogData);
      setOriginalForm(blogData);
      setBlogMeta({
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        author: data.author
      });
      
      if (data.image) {
        setImagePreview(data.image);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      alert('Failed to load blog. Redirecting to blog list.');
      router.push('/dashboard/blogs');
    } finally {
      setIsLoading(false);
    }
  };

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
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const blogData = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };
      
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData),
      });

      if (res.ok) {
        setOriginalForm(form); // Reset unsaved changes
        router.push('/dashboard/blogs');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (hasUnsavedChanges && !confirm('Are you sure you want to discard all changes?')) {
      return;
    }
    setForm(originalForm);
    setImagePreview(originalForm.image || '');
    setErrors({});
  };

  const wordCount = form.content.trim().split(/\s+/).filter(word => word).length;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-16 bg-white rounded-lg mb-6"></div>
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-48 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard/blogs"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                onClick={(e) => {
                  if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
                    e.preventDefault();
                  }
                }}
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Blogs
              </Link>
              <div className="h-6 w-px bg-gray-300 mr-4"></div>
              <h1 className="text-xl font-semibold text-gray-900">Edit Blog Post</h1>
              {hasUnsavedChanges && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Unsaved changes
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-0">
        {/* Blog Meta Information */}
        {blogMeta && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-700">
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                Created: {formatDate(blogMeta.createdAt)}
              </div>
              {blogMeta.updatedAt && blogMeta.updatedAt !== blogMeta.createdAt && (
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  Last updated: {formatDate(blogMeta.updatedAt)}
                </div>
              )}
              {blogMeta.author && (
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-1" />
                  Author: {blogMeta.author}
                </div>
              )}
            </div>
          </div>
        )}

        {showPreview ? (
          /* Preview Mode */
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {form.title || 'Untitled Post'}
              </h1>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>{form.status} • {estimatedReadTime} min read</span>
                {form.tags && (
                  <div className="ml-4 flex flex-wrap gap-2">
                    {form.tags.split(',').map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {imagePreview && (
                <div className="mb-6">
                  <img
                    src={imagePreview}
                    alt="Blog post"
                    className="w-full h-64 object-cover rounded-lg"
                    onError={() => setImagePreview('')}
                  />
                </div>
              )}

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {form.content || 'Start writing your blog content...'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Title Section */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Title *
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter an engaging title for your blog post..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Content Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content *
                  </label>
                  <div className="text-sm text-gray-500">
                    {wordCount} words • ~{estimatedReadTime} min read
                  </div>
                </div>
                <textarea
                  id="content"
                  placeholder="Share your thoughts, insights, and stories..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                    errors.content ? 'border-red-300' : 'border-gray-300'
                  }`}
                  rows="12"
                  required
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {errors.content}
                  </p>
                )}
              </div>

              {/* Image Section */}
              <div className="mb-6">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="space-y-3">
                  <input
                    id="image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={form.image}
                    onChange={handleImageChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.image ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.image && (
                    <p className="text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                      {errors.image}
                    </p>
                  )}
                  {imagePreview && (
                    <div className="relative">
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
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                          Valid
                        </span>
                      </div>
                    </div>
                  )}
                  {!imagePreview && form.image && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <PhotoIcon className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Enter a valid image URL to see preview</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <DocumentTextIcon className="w-4 h-4 mr-1" />
                  {hasUnsavedChanges ? 'You have unsaved changes' : 'All changes saved'}
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleDiscard}
                    disabled={!hasUnsavedChanges}
                    className={`px-4 py-2 text-gray-700 bg-gray-100 rounded-lg transition-colors duration-200 ${
                      hasUnsavedChanges 
                        ? 'hover:bg-gray-200' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Discard Changes
                  </button>
                  
                  <Link
                    href="/blogs"
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    onClick={(e) => {
                      if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Cancel
                  </Link>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !hasUnsavedChanges}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center ${
                      isSubmitting || !hasUnsavedChanges
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Blog'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}