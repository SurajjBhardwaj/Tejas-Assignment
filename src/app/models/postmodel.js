import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });


mongoose.models = {}
export default mongoose.model("Post", postSchema);