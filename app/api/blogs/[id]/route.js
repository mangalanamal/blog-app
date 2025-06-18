// app/api/blogs/[id]/route.js
import connectDB from '@/lib/dbConnect';
import Blog from '@/models/Blog';
import jwt from 'jsonwebtoken';

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { title, content } = await req.json();

  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      { title, content },
      { new: true }
    );

    if (!updatedBlog) {
      return Response.json({ error: 'Blog not found or not yours' }, { status: 404 });
    }

    return Response.json({ message: 'Blog updated', blog: updatedBlog }, { status: 200 });
  } catch (err) {
    return Response.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const deletedBlog = await Blog.findOneAndDelete({ _id: id, userId: decoded.userId });

    if (!deletedBlog) {
      return Response.json({ error: 'Blog not found or not yours' }, { status: 404 });
    }

    return Response.json({ message: 'Blog deleted' }, { status: 200 });
  } catch (err) {
    return Response.json({ error: 'Delete failed' }, { status: 500 });
  }
}

export async function GET(req, { params }) {
 try {
    await connectDB();
    const blog = await Blog.findById(params.id);
    if (!blog) {
      return Response.json({ message: 'Blog not found' }, { status: 404 });
    }
    return Response.json(blog, { status: 200 });
  } catch (err) {
    return Response.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}