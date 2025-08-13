import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
  {
    content: { type: String, required: true },

    
    //Only one to be filled
    video: { type: Schema.Types.ObjectId, ref: "Video" },
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
    image: { type: Schema.Types.ObjectId, ref: "Image" },

    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);
