import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    jobs: [],
    session: [
      {
        token: { type: String },
        expireAt: { type: Date },
        location: {
          type: { type: String, default: "Point" },
          coordinates: { type: [Number] },
        },
        device: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    log: [
      {
        action: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

mongoose.models = {}
export default mongoose.model("User", userSchema);

