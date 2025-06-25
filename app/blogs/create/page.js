'use client';
import dynamic from 'next/dynamic';

const CreateBlog = dynamic(() => import('@/app/components/createBlog'), { ssr: false });

export default function CreateBlogPage() {
  return <CreateBlog />;
}
