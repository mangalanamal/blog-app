'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CalendarIcon, 
  EyeIcon,
  SearchIcon,
  FilterIcon
} from '@heroicons/react/24/outline';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
 // const token =  sessionStorage.getItem('token');
const [token, setToken] = useState(null);

useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken);
  }
}, []);

useEffect(() => {
  if (token) {
    fetchBlogs();
  }
}, [token]); // <-- this runs when token is set


  const fetchBlogs = async () => {
    try {
      setLoading(true);    
  

const res = await fetch('/api/blogs/myblogs', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`, // <-- Add your JWT token here
    'Content-Type': 'application/json',
    },
    });
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;

    try {
      const res = await fetch(`/api/blogs/${blogToDelete._id}`, {
        method: 'DELETE',
        headers: {
                'Authorization': `Bearer ${token}`
        },
      });

      if (res.ok) {
        setBlogs(blogs.filter((b) => b._id !== blogToDelete._id));
        setShowDeleteModal(false);
        setBlogToDelete(null);
      } else {
        alert('Failed to delete blog.');
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('An error occurred while deleting the blog.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  // Filter and sort blogs
  const filteredAndSortedBlogs = blogs
    .filter(blog => 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Blog Posts</h1>
              <p className="text-gray-600">
                Manage and organize your blog content
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href="/blogs/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create New Post
              </Link>
            </div>
          </div>
        </div>

        {/* Blog List */}
        {filteredAndSortedBlogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <PencilIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'No blogs found' : 'No blog posts yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Start writing your first blog post to share your thoughts with the world'
              }
            </p>
            {!searchTerm && (
              <Link
                href="/blogs/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredAndSortedBlogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        <span>{formatDate(blog.createdAt)}</span>
                        {blog.status && (
                          <>
                            <span className="mx-2">•</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              blog.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {blog.status}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {truncateContent(blog.content)}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/blogs/${blog._id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </Link>
                      <Link
                        href={`/blogs/edit/${blog._id}`}
                        className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(blog)}
                      className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Blog Post</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

}