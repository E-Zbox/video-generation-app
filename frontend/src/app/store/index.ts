import { io, Socket } from "socket.io-client";
import { create } from "zustand";

const NEXT_PUBLIC_SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface IError {
  message: string;
  success: boolean;
}

interface IRecord {
  [id: string]: IError;
}

interface IAppStore {
  errorState: IRecord;
  deleteFromErrorState: (id: string) => void;
  updateErrorState: (newState: IError) => void;
  navbarHeightState: string;
  setNavbarHeightState: (newState: string) => void;
  socketState: Socket;
  // setSocketState: (newState: Socket)=> void;
}

export const useAppStore = create<IAppStore>((set) => ({
  errorState: {},
  deleteFromErrorState: (id: string) =>
    set((prevState) => {
      let updatedErrorState = prevState.errorState;

      delete updatedErrorState[id];

      return { ...prevState, errorState: updatedErrorState };
    }),
  updateErrorState: (newState: IError) =>
    set((prevState) => {
      const id = `${Math.random()}-${Date.now()}`;

      return {
        ...prevState,
        errorState: { ...prevState.errorState, [id]: newState },
      };
    }),
  navbarHeightState: "0px",
  setNavbarHeightState: (newState: string) =>
    set({ navbarHeightState: newState }),
  socketState: io(NEXT_PUBLIC_SERVER_BASE_URL),
}));
