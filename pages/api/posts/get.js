import connectDB from "@/app/middleware/connectDB";
import postmodel from "@/app/models/postmodel";
import usermodel from "@/app/models/usermodel";
import jwt from "jsonwebtoken";
import cookie from "cookie";


export default async function GET(req, res) {

    try {

        await connectDB();

        const posts = await postmodel.find({}).populate("user", "name email");

        if (!posts) {
            return res.status(404).json({ message: "No posts found" });
        }

        const cookies = cookie.parse(req.headers.cookie || ""); // Get all cookies from the request headers
        const token = cookies.authToken; // Extract the authToken cookie

        // console.log("authTOken is here : ", token);

        // If you want to parse the cookie and extract a specific value (e.g., userId)
        const decoded = jwt.verify(token, process.env.secretKey);

        // Now you can access the userId
        const userId = decoded.userId;

        // console.log(userId);


        // filter jobs 
         const createdJobs = posts.filter(
           (post) => post.user._id.toString() === userId.toString()
         );
         const availableJobs = posts.filter(
           (post) => post.user._id.toString() !== userId.toString()
         );
        
        const appliedJobs = posts.filter(
            (post) => post.appliedUsers.includes(userId)
        );

        return res.status(200).json({
          message: "Posts found",
          createdJobs,
          availableJobs,
          appliedJobs,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}