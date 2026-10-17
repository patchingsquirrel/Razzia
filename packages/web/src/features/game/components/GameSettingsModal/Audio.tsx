import { AUDIO_MODES } from "@razzia/common/constants"
import type { AudioMode, GameSettings } from "@razzia/common/types/game"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@razzia/web/components/Select"
import SettingRow from "@razzia/web/features/game/components/GameSettingsModal/SettingRow"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

const options: Array<{ value: AudioMode; label: string }> = [
  { value: AUDIO_MODES.ALL, label: "game:settings.audio.everyone" },
  { value: AUDIO_MODES.MANAGER, label: "game:settings.audio.mainScreen" },
  { value: AUDIO_MODES.OFF, label: "game:settings.audio.off" },
]

interface Props {
  name: "audio.sfx" | "audio.music"
  label: string
}

const AudioModeRow = ({ name, label }: Props) => {
  const { control } = useFormContext<GameSettings>()
  const { t } = useTranslation()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <SettingRow label={label}>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-44" aria-label={t(label)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value, label: optionLabel }) => (
                <SelectItem key={value} value={value}>
                  {t(optionLabel)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingRow>
      )}
    />
  )
}

const Audio = () => (
  <>
    <AudioModeRow name="audio.sfx" label="game:settings.audio.effects" />
    <AudioModeRow name="audio.music" label="game:settings.audio.music" />
  </>
)

export default Audio
