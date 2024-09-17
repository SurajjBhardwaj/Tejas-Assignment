import usermodel from "@/app/models/usermodel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import connectDB from "@/app/middleware/connectDB";

export default async function login(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Connect to the database
  await connectDB();

  // Extract data from request body
  const { email, password } = req.body;

  console.log(email, password);

  // Check if the user exists
  const userCheck = await usermodel.findOne({ email });

  if (!userCheck) {
    return res
      .status(400)
      .json({ success: false, message: "User does not exist", data: [] });
  }
    
    console.log(process.env.PASSWORD_SALT)

  // Check if the password is correct
  const isPasswordCorrect = await bcrypt.compare(
    password + process.env.PASSWORD_SALT,
    userCheck.password
  );

  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials", data: [] });
  }

  // Check for an existing valid session token
  let authToken;
  const now = new Date();

  const existingSession = userCheck.session.find((sess) => sess.expireAt > now);

  if (existingSession) {
    authToken = existingSession.token;
  } else {
    // Generate a new token
    authToken = generateAuthToken(userCheck._id);

    // Log the new session
    const session = {
      token: authToken,
      expireAt: new Date(now.getTime() + 10 * 60 * 60 * 1000), // 10 hours from now
      device: req.headers["user-agent"],
    };

    if (!userCheck.session) {
      userCheck.session = [];
    }

    // Limit session array to last 5 sessions
    if (userCheck.session.length >= 5) {
      userCheck.session.shift();
    }

    userCheck.session.push(session);

    // Log the action
    const log = {
      action: "Login",
      timestamp: new Date(),
    };

    if (!userCheck.log) {
      userCheck.log = [];
    }

    userCheck.log.push(log);

    await userCheck.save();
  }

  // Set the token as a cookie
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      maxAge: 10 * 60 * 60, // 10 hours
      sameSite: "strict",
      path: "/",
    })
  );

  const data = {
    user: userCheck,
    authToken,
  };

  return res
    .status(200)
    .json({ success: true, message: "Login successful", data });
}

function generateAuthToken(userId) {
  const payload = {
    userId,
  };

  const options = {
    expiresIn: "10h", // Token expiration time
  };

  const token = jwt.sign(payload, process.env.secretKey, options);
  return token;
}

