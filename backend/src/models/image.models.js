import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const imageSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    imageFile: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imagePublicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

imageSchema.plugin(mongooseAggregatePaginate);

export const Image = mongoose.model("Image", imageSchema);
