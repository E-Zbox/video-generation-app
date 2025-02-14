import { model, Model, Schema, Types } from "mongoose";

export interface IPictoryToken {
  _id?: Types.ObjectId;
  accessToken: string;
  expiresIn: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IPictoryTokenSchema extends Model<IPictoryToken>, IPictoryToken {}

const pictoryTokenSchema = new Schema<IPictoryTokenSchema>(
  {
    accessToken: {
      required: [true, "`accessToken` field is required"],
      type: String,
    },
    expiresIn: {
      required: [true, "`expiresIn` field is required"],
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default model("PictoryToken", pictoryTokenSchema);
