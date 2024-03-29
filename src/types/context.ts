import { ReactNode } from "react";

import { FileActionType } from "@/constants";

export type ReducerAction<T, P> = {
  type: T;
  payload?: Partial<P>;
};


export type FileContextState = {
  isLoading: boolean;
  file: File | null;
  fileList: File[]; // & {} You can add more information about the challenge inside this type
};

export type FileAction =
  | ReducerAction<FileActionType.SET_UPLOAD_FILE, File | null>
  | ReducerAction<'CLEAR_FILE', undefined>
  | ReducerAction<FileActionType.SET_FILE_LIST, File[]>
  | ReducerAction<FileActionType.SET_IS_LOADING, boolean>;

export type FileDispatch = ({ type, payload }: FileAction) => void;

export type FileContextType = {
  state: FileContextState;
  dispatch: FileDispatch;
};

export type FileProviderProps = { children: ReactNode };
