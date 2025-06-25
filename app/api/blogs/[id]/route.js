// app/api/blogs/[id]/route.js
import connectDB from '@/lib/dbConnect';
import Blog from '@/models/Blog';
import jwt from 'jsonwebtoken';

// 🟢 GET single blog by ID (only if belongs to logged-in user)
export async function GET(req, { params }) {
  await connectDB();

  const { id } = params;
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const blog = await Blog.findOne({ _id: id, userId: decoded.userId });

    if (!blog) {
      return Response.json({ error: "Blog not found or not yours" }, { status: 404 });
    }

    return Response.json(blog, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

// 🟡 PUT update blog by ID
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { title, content, image, status } = await req.json();

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      { title, content, image, status },
      { new: true }
    );

    if (!updatedBlog) {
      return Response.json({ error: "Blog not found or not yours" }, { status: 404 });
    }

    return Response.json({ message: "Blog updated", blog: updatedBlog }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

// 🔴 DELETE blog by ID
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const deletedBlog = await Blog.findOneAndDelete({ _id: id, userId: decoded.userId });

    if (!deletedBlog) {
      return Response.json({ error: "Blog not found or not yours" }, { status: 404 });
    }

    return Response.json({ message: "Blog deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}
