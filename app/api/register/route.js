// app/api/register/route.js
import connectDB from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await connectDB();

  const { username, email, password } = await req.json();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return Response.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (err) {
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
