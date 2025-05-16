import mongoose, { mongo } from "mongoose";

const Postschema = new mongoose.Schema({
  title: String,
  content: String,
  image: {
    type: String,
    required: true,
    default:
      "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

export default mongoose.model("Post", Postschema);
