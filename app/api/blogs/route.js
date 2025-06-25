// app/api/blogs/route.js
import connectDB from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { title, content } = await req.json();

    const newBlog = new Blog({
      title,
      content,
      userId: decoded.userId,
    });

    await newBlog.save();

    return Response.json(
      { message: "Blog created successfully", blog: newBlog },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Blog creation failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return Response.json({ blogs });
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch blogs", error },
      { status: 500 }
    );
  }
}

