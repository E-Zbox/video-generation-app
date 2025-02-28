import { FFmpeg } from "@ffmpeg/ffmpeg";
import { io, Socket } from "socket.io-client";
import { temporal } from "zundo";
import { create } from "zustand";
// interfaces
import {
  IMediaFile,
  IMediaResponseRecord,
  IMessage,
  IMessageRecord,
  IScene,
  IVoiceOverRecord,
} from "./interfaces";
import { IThumbnail, IVideoMeta } from "../screens/interface";
import {
  IStoryboard,
  IStoryboardAudio,
  IStoryboardOutput,
  IStoryboardScene,
} from "./interfaces/storyboard";
import { IMedia } from "@/api/interfaces/media";
import { IVoiceOverTrack } from "@/api/interfaces/voiceover";
// trayTab
import { IMenu, menu } from "./trayTab";

const NEXT_PUBLIC_SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface IAppStore {
  ffmpegState: null | FFmpeg;
  setFFmpegState: (newState: FFmpeg) => void;
  messageState: IMessageRecord;
  deleteFromMessageState: (id: string) => void;
  editMessageInMessageState: (id: string, newMessage: string) => void;
  updateMessageState: (newState: IMessage) => string;
  navbarHeightState: string;
  setNavbarHeightState: (newState: string) => void;
  socketState: Socket;
  // setSocketState: (newState: Socket)=> void;
}

export const useAppStore = create<IAppStore>((set) => ({
  ffmpegState: null,
  setFFmpegState: (newState: FFmpeg) => set({ ffmpegState: newState }),
  messageState: {},
  deleteFromMessageState: (id: string) =>
    set((prevState) => {
      let updatedMessageState = prevState.messageState;

      delete updatedMessageState[id];

      return { ...prevState, messageState: updatedMessageState };
    }),
  editMessageInMessageState: (id: string, newMessage: string) =>
    set((prevState) => ({
      ...prevState,
      messageState: {
        ...prevState.messageState,
        [id]: { ...prevState.messageState[id], message: newMessage },
      },
    })),
  updateMessageState: (newState: IMessage) => {
    let id = "";

    set((prevState) => {
      id = `${Math.random()}-${Date.now()}`;

      return {
        ...prevState,
        messageState: { ...prevState.messageState, [id]: newState },
      };
    });

    return id;
  },
  navbarHeightState: "0px",
  setNavbarHeightState: (newState: string) =>
    set({ navbarHeightState: newState }),
  socketState: io(NEXT_PUBLIC_SERVER_BASE_URL),
}));

interface IVideoMetadataRecord {
  [urlKey: string]: IVideoMeta;
}

interface IThumbnailRecord {
  [urlKey: string]: string;
}

interface IReplaceBgState {
  activated: boolean;
  transientValue: string;
  type: "image" | "video";
}

interface IEditorStore {
  aiGeneratedScenes: string[];
  setAiGeneratedScenes: (newState: string[]) => void;
  selectedAiGeneratedSceneIndex: null | number;
  setSelectedAiGeneratedScenes: (newState: null | number) => void;
  replaceBgState: IReplaceBgState;
  setReplaceBgState: (newState: IReplaceBgState) => void;
  selectedMediaState: IMediaFile[];
  updateSelectedMediaState: (file: File) => void;
  removeSelectedMediaState: (id: string) => void;
  tabMenuState: IMenu[];
  selectTabMenuState: (index: number) => void;
  selectedTabMenuIndexState: number;
  uploadedMediaState: IMediaResponseRecord;
  updateUploadedMediaState: (newState: IMedia) => void;
  removeFromUploadedMediaState: (id: string) => void;
  selectedUploadedMediaIdState: string;
  setSelectedUploadedMediaIdState: (newState: string) => void;
  voiceoverTrackState: IVoiceOverRecord;
  pauseVoiceoverTrackState: (language: string, voiceoverId: string) => void;
  playVoiceoverTrackState: (language: string, voiceoverId: string) => void;
  selectVoiceoverTrackState: (language: string, voiceoverId: string) => void;
  setVoiceoverTrackState: (newState: IVoiceOverTrack[]) => void;
  thumbnailState: IThumbnailRecord;
  updateThumbnailState: (urlKey: string, newState: string) => void;
  setThumbnailState: (newState: IThumbnailRecord) => void;
  videoMetadataState: IVideoMetadataRecord;
  updateVideoMetadataState: (urlKey: string, newState: IVideoMeta) => void;
  setVideoMetadataState: (newState: IVideoMetadataRecord) => void;
}

export const useEditorStore = create<IEditorStore>()((set) => ({
  aiGeneratedScenes: [],
  setAiGeneratedScenes: (newState: string[]) =>
    set({ aiGeneratedScenes: newState }),
  selectedAiGeneratedSceneIndex: null,
  setSelectedAiGeneratedScenes: (newState: null | number) =>
    set({ selectedAiGeneratedSceneIndex: newState }),
  replaceBgState: { activated: false, transientValue: "", type: "video" },
  setReplaceBgState: (newState: IReplaceBgState) =>
    set({ replaceBgState: newState }),
  selectedMediaState: [],
  updateSelectedMediaState: (file: File) =>
    set((prevState) => ({
      ...prevState,
      selectedMediaState: [
        { id: `${Math.random()}-${Date.now()}`, file },
        ...prevState.selectedMediaState,
      ],
    })),
  removeSelectedMediaState: (id: string) =>
    set((prevState) => {
      const updatedSelectedMediaState: IMediaFile[] = [];

      prevState.selectedMediaState.forEach((mediaState) => {
        if (mediaState.id !== id) {
          updatedSelectedMediaState.push(mediaState);
        }
      });

      return { ...prevState, selectedMediaState: updatedSelectedMediaState };
    }),
  tabMenuState: menu,
  selectTabMenuState: (index: number) =>
    set((prevState) => {
      const updatedTabMenu = prevState.tabMenuState.map((item, idx) => ({
        ...item,
        selected: index === idx,
      }));

      return {
        ...prevState,
        tabMenuState: updatedTabMenu,
        selectedTabMenuIndexState: index,
      };
    }),
  selectedTabMenuIndexState: 0,
  uploadedMediaState: {},
  updateUploadedMediaState: (newState: IMedia) =>
    set((prevState) => ({
      ...prevState,
      uploadedMediaState: {
        ...prevState.uploadedMediaState,
        [newState._id]: newState,
      },
    })),
  removeFromUploadedMediaState: (id: string) =>
    set((prevState) => {
      const updatedState = {
        ...prevState.uploadedMediaState,
      };

      delete updatedState[id];

      return {
        ...prevState,
        uploadedMediaState: updatedState,
      };
    }),
  selectedUploadedMediaIdState: "",
  setSelectedUploadedMediaIdState: (newState: string) =>
    set({ selectedUploadedMediaIdState: newState }),
  voiceoverTrackState: {},
  pauseVoiceoverTrackState: (language: string, voiceoverId: string) =>
    set((prevState) => {
      const state = prevState.voiceoverTrackState;

      const updatedState: IVoiceOverRecord = {
        ...state,
        [language]: {
          ...state[language],
          [voiceoverId]: {
            ...state[language][voiceoverId],
            playing: false,
          },
        },
      };

      return {
        ...prevState,
        voiceoverTrackState: updatedState,
      };
    }),
  playVoiceoverTrackState: (language: string, voiceoverId: string) =>
    set((prevState) => {
      const languages = Object.getOwnPropertyNames(
        prevState.voiceoverTrackState
      );
      const updatedState: IVoiceOverRecord = {};

      languages.forEach((_lang) => {
        const ids = Object.getOwnPropertyNames(
          prevState.voiceoverTrackState[_lang]
        );

        ids.forEach((_id) => {
          const voiceover = prevState.voiceoverTrackState[_lang][_id];

          updatedState[_lang] = {
            ...updatedState[_lang],
            [_id]: {
              ...voiceover,
              playing: language == _lang && voiceoverId == _id,
            },
          };
        });
      });

      return {
        ...prevState,
        voiceoverTrackState: updatedState,
      };
    }),
  selectVoiceoverTrackState: (language: string, voiceoverId: string) =>
    set((prevState) => {
      const languages = Object.getOwnPropertyNames(
        prevState.voiceoverTrackState
      );
      const updatedState: IVoiceOverRecord = {};

      languages.forEach((_lang) => {
        const ids = Object.getOwnPropertyNames(
          prevState.voiceoverTrackState[_lang]
        );

        ids.forEach((_id) => {
          const voiceover = prevState.voiceoverTrackState[_lang][_id];

          updatedState[_lang] = {
            ...updatedState[_lang],
            [_id]: {
              ...voiceover,
              selected: language == _lang && _id == voiceoverId,
            },
          };
        });
      });

      return {
        ...prevState,
        voiceoverTrackState: updatedState,
      };
    }),
  setVoiceoverTrackState: (newState: IVoiceOverTrack[]) =>
    set((prevState) => {
      const voiceoverTrackState: IVoiceOverRecord = {
        // ...prevState.voiceoverTrackState,
        // [language]: {
        //   ...prevState.voiceoverTrackState[language],
        //   [voiceover.id]: voiceover
        // },
      };

      newState.forEach((voiceoverTrack) => {
        voiceoverTrackState[voiceoverTrack.language] = {
          ...voiceoverTrackState[voiceoverTrack.language],
          [`${voiceoverTrack.id}`]: {
            ...voiceoverTrack,
            playing: false,
            selected: false,
          },
        };
      });

      return {
        ...prevState,
        voiceoverTrackState,
      };
    }),
  thumbnailState: {},
  updateThumbnailState: (urlKey: string, newState: string) =>
    set((prevstate) => {
      const updatedState: IThumbnailRecord = {
        ...prevstate.thumbnailState,
        [urlKey]: newState,
      };

      return {
        ...prevstate,
        thumbnailState: updatedState,
      };
    }),
  setThumbnailState: (newState: IThumbnailRecord) =>
    set({ thumbnailState: newState }),
  videoMetadataState: {},
  updateVideoMetadataState: (urlKey: string, newState: IVideoMeta) =>
    set((prevState) => {
      const updatedState: IVideoMetadataRecord = {
        ...prevState.videoMetadataState,
        [urlKey]: newState,
      };

      return {
        ...prevState,
        videoMetadataState: updatedState,
      };
    }),
  setVideoMetadataState: (newState: IVideoMetadataRecord) =>
    set({ videoMetadataState: newState }),
}));

interface ITrimmedBackgroundVideo {
  leftOffset: number; // (in pixels) relative to parent's scrollWidth
  rightOffset: number; // (in pixels) relative to parent's scrollWidth
  // topOffset: number;
  video: string;
}

interface ITrimmedBackgroundRecord {
  [urlKey: string]: ITrimmedBackgroundVideo;
}

interface ITrimmedThumbnailRecord {
  [urlKey: string]: IThumbnail[];
}

interface IStoryboardEditorState {
  audioState: IStoryboardAudio;
  loadingState: boolean;
  outputState: IStoryboardOutput;
  sceneState: IStoryboardScene[];
  selectedSceneIndex: null | number;
  trimActivatedState: boolean;
  trimmedBackgroundVideoState: ITrimmedBackgroundRecord;
  trimmedThumbnailState: ITrimmedThumbnailRecord;
}

interface IStoryboardEditorStore extends IStoryboardEditorState {
  audioRefState: null | HTMLAudioElement;
  setAudioRefState: (newState: HTMLAudioElement) => void;
  setLoadingState: (newState: boolean) => void;
  setStoryboardState: (newState: IStoryboardEditorState) => void;
  updateSceneBackgroundUrlState: (
    sceneIndex: number,
    backgroundSrcIndex: number,
    url: string,
    type: "image" | "video"
  ) => void;
  setSelectedSceneIndex: (newState: number) => void;
  setTrimActivatedState: (newState: boolean) => void;
  updateTrimmedBackgroundVideoState: (
    urlKey: string,
    trimmedBackground: ITrimmedBackgroundVideo
  ) => void;
  updateTrimmedThumbnailState: (urlKey: string, newState: IThumbnail[]) => void;
}

export const useStoryboardEditorStore = create<IStoryboardEditorStore>()(
  temporal((set) => ({
    audioRefState: null,
    setAudioRefState: (newState: HTMLAudioElement) =>
      set({ audioRefState: newState }),
    audioState: {
      video_volume: 0,
      audio_id: "",
      audio_library: "",
      src: "",
      track_volume: 0,
      // tts: "", undefined
    },
    loadingState: false,
    outputState: {
      name: "",
      description: "",
      format: "",
      title: "",
      height: 0,
      width: 0,
    },
    sceneState: [],
    setStoryboardState: (newState: IStoryboardEditorState) =>
      set({
        ...newState,
      }),
    setLoadingState: (newState: boolean) => set({ loadingState: newState }),
    updateSceneBackgroundUrlState: (
      sceneIndex: number,
      backgroundSrcIndex: number,
      url: string,
      type: "image" | "video"
    ) =>
      set((prevState) => {
        const updatedSceneState = prevState.sceneState.map((scene, index) => {
          if (sceneIndex !== index) {
            return scene;
          }

          return {
            ...scene,
            background: {
              ...scene.background,
              src: scene.background.src.map((bgSrc, idx) => {
                if (backgroundSrcIndex !== idx) {
                  return bgSrc;
                }

                console.log({ url, idx });

                return {
                  ...bgSrc,
                  url,
                  type,
                };
              }),
            },
          };
        });

        return {
          ...prevState,
          sceneState: updatedSceneState,
        };
      }),
    selectedSceneIndex: null,
    setSelectedSceneIndex: (newState: number) =>
      set({ selectedSceneIndex: newState }),
    trimActivatedState: false,
    setTrimActivatedState: (newState: boolean) =>
      set({ trimActivatedState: newState }),
    trimmedBackgroundVideoState: {},
    updateTrimmedBackgroundVideoState: (
      urlKey: string,
      trimmedBackground: ITrimmedBackgroundVideo
    ) =>
      set((prevState) => {
        const updatedState: ITrimmedBackgroundRecord = {
          ...prevState.trimmedBackgroundVideoState,
          [urlKey]: trimmedBackground,
        };

        return {
          ...prevState,
          trimmedBackgroundVideoState: updatedState,
        };
      }),
    trimmedThumbnailState: {},
    updateTrimmedThumbnailState: (urlKey: string, newState: IThumbnail[]) =>
      set((prevState) => {
        const updatedState: ITrimmedThumbnailRecord = {
          ...prevState.trimmedThumbnailState,
          [urlKey]: newState,
        };

        return {
          ...prevState,
          trimmedThumbnailState: updatedState,
        };
      }),
  }))
);
