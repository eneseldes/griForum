import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"], 
    default: "user",
  },
  likedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  savedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  likedComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema, "users");
export default User;