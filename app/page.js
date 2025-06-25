import React from 'react';

async function getBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`, {
    cache: 'no-store', // ensures fresh data
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blogs');
  }

  return res.json();
}

export default async function HomePage() {
  const { blogs } = await getBlogs();

  // Pick a random blog
  const randomIndex = Math.floor(Math.random() * blogs.length);
  const featured = blogs[randomIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* 🔹 Hero Section with Featured Blog */}
      {featured && (
        <section className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
          
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12 mt-12">
        
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Insights</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                Discover thought-provoking articles, tutorials, and insights from our community of writers and creators.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div className="relative">
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border border-gray-100">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-10"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl leading-tight">
                      {featured.title}
                    </h2>
                    
                    <p className="mt-6 text-lg text-gray-600 leading-relaxed line-clamp-4">
                      {featured.content}
                    </p>
                    
                    <div className="mt-8">
                      <a 
                        href={`/blogs/${featured._id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        Read Full Article
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative">
                  <img
                    src={featured.image || `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 100) + 1}`}
                    className="rounded-2xl w-full h-96 object-cover shadow-2xl"
                    alt={featured.title}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Floating elements for visual interest */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 blur-xl"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 🔹 Blog Grid Section */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              All Articles
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of articles covering various topics and insights
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xl text-gray-500">No blog posts found.</p>
              <p className="text-gray-400 mt-2">Check back later for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <article 
                  key={blog._id} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      alt={blog.title}
                      src={blog.image || `https://picsum.photos/400/250?random=${Math.floor(Math.random() * 100) + 1}`}
                      className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Read more overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <a 
                        href={`/blogs/${blog._id}`}
                        className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:shadow-xl"
                      >
                        Read More
                      </a>
                    </div>
                  </div>

                  <div className="p-6">
                    <a href={`/blogs/${blog._id}`} className="block">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 mb-3">
                        {blog.title}
                      </h3>
                    </a>

                    <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
                      {blog.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-500">Article</span>
                      </div>
                      
                      <a 
                        href={`/blogs/${blog._id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 flex items-center gap-1"
                      >
                        Read
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}