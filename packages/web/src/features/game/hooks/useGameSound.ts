import { AUDIO_MODES } from "@razzia/common/constants"
import { useAudioStore } from "@razzia/web/features/game/stores/audio"
import useSound from "use-sound"

type SoundKind = "sfx" | "music"

interface SoundOptions {
  volume?: number
  loop?: boolean
  interrupt?: boolean
  onplay?: () => void
  onend?: () => void
}

export const useGameSound = (
  src: string,
  kind: SoundKind,
  options: SoundOptions = {},
) => {
  const mode = useAudioStore((state) => state[kind])
  const isMainScreen = useAudioStore((state) => state.isMainScreen)
  const enabled =
    mode === AUDIO_MODES.ALL || (mode === AUDIO_MODES.MANAGER && isMainScreen)

  return useSound(src, {
    ...options,
    soundEnabled: enabled,
    volume: enabled ? (options.volume ?? 1) : 0,
  })
}
