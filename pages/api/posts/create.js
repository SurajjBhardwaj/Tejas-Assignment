import usermodel from "@/app/models/usermodel";
import postmodel from "@/app/models/postmodel";
import connectDB from "@/app/middleware/connectDB";
import jwt from "jsonwebtoken";
import cookie from "cookie";



export default async function POST(req, res) {
    
    try {
        
        await connectDB();
        const { title, description } = req.body;



        const cookies = cookie.parse(req.headers.cookie || "");; // Get all cookies from the request headers
        // console.log(authToken);

        const token = cookies.authToken; // Extract the authToken cookie

        // console.log("authTOken is here : ", token);

        // If you want to parse the cookie and extract a specific value (e.g., userId)
        const decoded = jwt.verify(token, process.env.secretKey);

        // Now you can access the userId
        const userId = decoded.userId;
        
        // console.log(userId);

        if (!userId) {
          return res
            .status(401)
            .json({ message: "user is not loggedIn" });
        }


        const user = await usermodel.findById(userId);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const post = new postmodel({
            title,
            description,
            user: user._id
        });

        user.jobs.push(post._id);

        await Promise.all([user.save(), post.save()]);
      
        return res.status(201).json({ message: "Post created successfully", post });


    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error", message: error.message});
    }





}