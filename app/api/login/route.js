// app/api/login/route.js
import connectDB from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return Response.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    }, { status: 200 });

  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}
