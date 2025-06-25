import React from 'react';

async function getBlog(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs//view/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blog');
  }

  return res.json();
}

// Mock function to get related blogs - replace with your actual API call
// async function getRelatedBlogs() {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?limit=3`, {
//       cache: 'no-store',
//     });
//     if (res.ok) {
//       const data = await res.json();
//       return data.blogs || [];
//     }
//   } catch (error) {
//     console.error('Failed to fetch related blogs:', error);
//   }
//   return [];
// }

export default async function BlogDetail({ params }) {
  const { id } = params;
  const blog = await getBlog(id);
  const relatedBlogs = await getRelatedBlogs();

  // Calculate reading time (approximate)
  const wordsPerMinute = 200;
  const wordCount = blog.content ? blog.content.split(' ').length : 0;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <a 
          href="/blogs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-8 group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all articles
        </a>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 pb-16">
        <header className="text-center mb-12">
       
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{readingTime} min read</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Author ID: {blog.userId}</span>
            </div>
          </div>
        
        </header>

        {/* Featured Image */}
        <div className="relative mb-12">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={blog.image || `https://picsum.photos/800/450?random=${Math.floor(Math.random() * 100) + 1}`}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-15 blur-xl"></div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-line font-serif">
              {blog.content}
            </div>
          </div>
        </div>
  
      </article>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              You might also like
            </h2>
            <p className="text-gray-600">
              Discover more articles from our collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedBlogs.slice(0, 3).map((relatedBlog, index) => (
              <article 
                key={relatedBlog._id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    alt={relatedBlog.title}
                    src={relatedBlog.image || `https://picsum.photos/400/250?random=${Math.floor(Math.random() * 100) + 1}`}
                    className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6">
                  <a href={`/blogs/${relatedBlog._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 mb-3">
                      {relatedBlog.title}
                    </h3>
                  </a>

                  <p className="text-gray-600 line-clamp-2 leading-relaxed mb-4 text-sm">
                    {relatedBlog.content}
                  </p>

                  <a 
                    href={`/blogs/${relatedBlog._id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                  >
                    Read Article
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}