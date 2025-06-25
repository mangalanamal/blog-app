// app/api/blogs/view/[id]/route.js
import connectDB from '@/lib/dbConnect';
import Blog from '@/models/Blog';

// 🟢 GET single blog by ID (only if belongs to logged-in user)
export async function GET(req, { params }) {
  await connectDB();

  const { id } = params;

  try {
    const blog = await Blog.findOne({ _id: id });

    if (!blog) {
      return Response.json({ error: "Blog not found or not yours" }, { status: 404 });
    }

    return Response.json(blog, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}
