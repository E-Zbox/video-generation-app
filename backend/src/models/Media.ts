import { model, Model, Schema, Types } from "mongoose";

const { ObjectId } = Schema;

export interface IMedia {
  _id?: Types.ObjectId;
  mimetype: string;
  path: string;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IMediaSchema extends Model<IMedia>, IMedia {}

const mediaSchema = new Schema<IMediaSchema>(
  {
    mimetype: {
      required: [true, "`mimetype` field is required"],
      type: String,
    },
    path: {
      required: [true, "`path` field is required"],
      type: String,
    },
    publicId: {
      required: [true, "`publicId` field is required"],
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Media", mediaSchema);
