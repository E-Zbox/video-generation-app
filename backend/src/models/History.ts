import { model, Model, Schema, Types } from "mongoose";

const { ObjectId } = Schema;

export interface IHistory {
  _id?: Types.ObjectId;
}
