import connectDB from "@/app/middleware/connectDB";
import postmodel from "@/app/models/postmodel";
import usermodel from "@/app/models/usermodel";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import mongoose from "mongoose";


export default async function POST(req, res) {
  try {
    await connectDB();

    // Extract jobId from the request body
    const { jobId, name, email } = req.body;

    // Ensure jobId is cast to ObjectId using `new`
    const objectIdJobId = new mongoose.Types.ObjectId(jobId);

    // Find the post using the cast ObjectId
    const post = await postmodel.findOne({ _id: objectIdJobId });

    if (!post) {
      return res.status(404).json({ message: "No job posts found" });
    }

    const cookies = cookie.parse(req.headers.cookie || ""); // Get all cookies from the request headers
    const token = cookies.authToken; // Extract the authToken cookie

    // Verify JWT token and extract userId
    const decoded = jwt.verify(token, process.env.secretKey);
    const userId = decoded.userId;

    // Find the user
    const user = await usermodel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add jobId to user's appliedJobs if not already applied
    if (!user.appliedJobs.includes(objectIdJobId)) {
      user.appliedJobs.push(objectIdJobId);
    }

    // Add userId to post's appliedUsers if not already applied
    if (!post.appliedUsers.includes(userId)) {
      post.appliedUsers.push(userId);
    }

    // Save the changes
    await Promise.all([user.save(), post.save()]);

    console.log("Successfully applied to the job");

    return res.status(200).json({ message: "Successfully applied to the job" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
