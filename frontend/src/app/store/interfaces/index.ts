import { IMedia } from "@/api/interfaces/media";
import { IVoiceOverTrack } from "@/api/interfaces/voiceover";

export interface IMessage {
  message: string;
  timeoutInMilliseconds?: number;
  success: boolean;
}

export interface IMessageRecord {
  [id: string]: IMessage;
}

export interface IMediaFile {
  id: string;
  file: File;
}

export interface IMediaResponseRecord {
  [_id: string]: IMedia;
}

export interface IScene {
  trimmedBase64: string;
  originalSrc: string;
}

export interface IVoiceOver extends IVoiceOverTrack {
  playing: boolean;
  selected: boolean;
}

export interface IVoiceOverRecord {
  [language: string]: { [id: string]: IVoiceOver };
}
