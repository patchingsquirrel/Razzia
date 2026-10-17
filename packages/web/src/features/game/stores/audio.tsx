import { AUDIO_MODES } from "@razzia/common/constants"
import type { AudioMode, AudioSettings } from "@razzia/common/types/game"
import { create } from "zustand"

interface AudioState {
  sfx: AudioMode
  music: AudioMode
  isMainScreen: boolean
}

type AudioStore = AudioState & {
  setAudio: (_audio: AudioSettings) => void
  setMainScreen: (_isMainScreen: boolean) => void
  resetAudio: () => void
}

const initialState: AudioState = {
  sfx: AUDIO_MODES.ALL,
  music: AUDIO_MODES.ALL,
  isMainScreen: false,
}

export const useAudioStore = create<AudioStore>((set) => ({
  ...initialState,

  setAudio: ({ sfx, music }) => set({ sfx, music }),

  setMainScreen: (isMainScreen) => set({ isMainScreen }),

  resetAudio: () => set(initialState),
}))
