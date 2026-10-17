import { AUDIO_MODES, AUTO_ADVANCE_DELAY } from "@razzia/common/constants"
import {
  inviteCodeValidator,
  usernameValidator,
} from "@razzia/common/validators/auth"
import z from "zod"

export const createGameValidator = z.object({
  quizzId: z.string().min(1, "errors:quizz.notFound"),
})

export const checkGameValidator = z.object({
  inviteCode: inviteCodeValidator,
})

export const joinGameValidator = z.object({
  inviteCode: inviteCodeValidator,
  username: usernameValidator.optional(),
})

const delayValidator = z
  .number()
  .int()
  .min(AUTO_ADVANCE_DELAY.MIN, "errors:game.invalidAutoAdvanceDelay")
  .max(AUTO_ADVANCE_DELAY.MAX, "errors:game.invalidAutoAdvanceDelay")

const audioModeValidator = z.enum([
  AUDIO_MODES.ALL,
  AUDIO_MODES.MANAGER,
  AUDIO_MODES.OFF,
])

export const gameSettingsSchema = z.object({
  generatedUsernames: z.boolean(),
  answersOnly: z.boolean(),
  autoAdvance: z.object({
    enable: z.boolean(),
    responsesDelay: delayValidator,
    leaderboardDelay: delayValidator,
  }),
  audio: z.object({
    sfx: audioModeValidator,
    music: audioModeValidator,
  }),
})

export const gameSettingsValidator = gameSettingsSchema.partial()
