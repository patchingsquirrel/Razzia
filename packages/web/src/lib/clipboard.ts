const writeViaClipboard = (text: string): Promise<boolean> => {
  const { clipboard } = navigator as { clipboard?: Clipboard }

  if (!clipboard) {
    return Promise.resolve(false)
  }

  return clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false)
}

const writeViaFallback = (text: string): boolean => {
  if (typeof document === "undefined") {
    return false
  }

  try {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    // oxlint-disable-next-line typescript/no-deprecated
    const copied = document.execCommand("copy")
    document.body.removeChild(textarea)

    return copied
  } catch {
    return false
  }
}

export const copyText = async (text: string): Promise<boolean> =>
  (await writeViaClipboard(text)) || writeViaFallback(text)
