import usermodel from "@/app/models/usermodel";
import connectDB from "@/app/middleware/connectDB";
import bcrypt from "bcrypt";

// Logic for creating a user inside the database
export default async function signup(req, res) {
  try {
    if (req.method !== "POST") {
      return res
        .status(400)
        .json({ success: false, message: "Method not allowed", data: [] });
    }
    await connectDB();
    const { name, email, password } = req.body;

    // check if email  password phone no is empty or not
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required", data: [] });
    }

    // check if email is valid email or not

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email", data: [] });
    }

    // check if user already exists
    const existingUser = await usermodel.findOne({
      email,
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists", data: [] });
    }

    const saltRounds = 10;
    const token = process.env.PASSWORD_SALT;
    const hashedPassword = await bcrypt.hash(password + token, saltRounds);

    const user = await new usermodel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: user,
      message: "user created successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key errors
      const duplicateFields = Object.keys(error.keyPattern);
      let errorMessage = "";
      duplicateFields.forEach((field) => {
        if (field === "email") {
          errorMessage += "Email";
        } else if (field === "phoneNo") {
          errorMessage += "Phone Number";
        } // Add more conditions for other unique fields if needed
        errorMessage += ", ";
      });
      errorMessage = errorMessage.slice(0, -2); // Remove the last comma and space

      return res
        .status(400)
        .json({ success: false, message: `${errorMessage} already exists` });
    } else if (error.errors) {
      // Handle validation errors for required fields
      const errorMessages = [];
      Object.values(error.errors).forEach((err) => {
        errorMessages.push(err.message);
      });

      return res
        .status(400)
        .json({ success: false, message: errorMessages.join(", ") });
    }
  }
}
