
// app/api/blogs/route.js
import connectDB from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import jwt from "jsonwebtoken";

export async function GET(req, res) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const blogs = await Blog.find({ userId: decoded.userId }).sort({ createdAt: -1 });


    //const userId = req.userId;
    //const blogs = await Blog.find({ userId: userId }).sort({ createdAt: -1 });
     return Response.json({ blogs }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch this user's blogs", error },
      { status: 500 }
    );
  }
}
