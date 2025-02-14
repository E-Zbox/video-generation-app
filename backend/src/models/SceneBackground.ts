import { model, Model, Schema, Types } from "mongoose";

const { ObjectId } = Schema;

export interface ISceneBackgroundSrc {
  asset_id: number;
  frame: null | string;
  library: string;
  loop_video: boolean;
  mute: boolean;
  resource_id: number;
  sessionId: string;
  type: string;
  url: string;
}

export interface ISceneBackground {
  _id?: Types.ObjectId;
  bg_animation: {
    animation: string;
  };
  color: string;
  src: ISceneBackgroundSrc[];
}

const SceneBackground = new Schema();
