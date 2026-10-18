import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const loadClipboard = () => import("@razzia/web/lib/clipboard")

const fakeTextarea = () => ({
  value: "",
  style: {} as Record<string, string>,
  setAttribute: vi.fn(),
  select: vi.fn(),
})

const stubDocument = (copied: boolean) => {
  const textarea = fakeTextarea()
  const appendChild = vi.fn()
  const removeChild = vi.fn()
  const execCommand = vi.fn(() => copied)

  vi.stubGlobal("document", {
    createElement: vi.fn(() => textarea),
    body: { appendChild, removeChild },
    execCommand,
  })

  return { textarea, appendChild, removeChild, execCommand }
}

beforeEach(() => {
  vi.resetModules()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("copyText", () => {
  it("uses the async clipboard api when available", async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>(() =>
      Promise.resolve(),
    )
    vi.stubGlobal("navigator", { clipboard: { writeText } })
    const { execCommand } = stubDocument(true)

    const { copyText } = await loadClipboard()

    await expect(copyText("https://host?pin=1234")).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith("https://host?pin=1234")
    expect(execCommand).not.toHaveBeenCalled()
  })

  it("falls back to execCommand when the clipboard api is missing", async () => {
    vi.stubGlobal("navigator", {})
    const { textarea, appendChild, removeChild, execCommand } =
      stubDocument(true)

    const { copyText } = await loadClipboard()

    await expect(copyText("https://host?pin=1234")).resolves.toBe(true)
    expect(textarea.value).toBe("https://host?pin=1234")
    expect(appendChild).toHaveBeenCalledWith(textarea)
    expect(removeChild).toHaveBeenCalledWith(textarea)
    expect(execCommand).toHaveBeenCalledWith("copy")
  })

  it("falls back to execCommand when the clipboard api rejects", async () => {
    const writeText = vi.fn(() => Promise.reject(new Error("denied")))
    vi.stubGlobal("navigator", { clipboard: { writeText } })
    const { execCommand } = stubDocument(true)

    const { copyText } = await loadClipboard()

    await expect(copyText("x")).resolves.toBe(true)
    expect(execCommand).toHaveBeenCalledWith("copy")
  })

  it("returns false when the fallback copy fails", async () => {
    vi.stubGlobal("navigator", {})
    stubDocument(false)

    const { copyText } = await loadClipboard()

    await expect(copyText("x")).resolves.toBe(false)
  })

  it("returns false when neither clipboard nor document is available", async () => {
    vi.stubGlobal("navigator", {})
    vi.stubGlobal("document", undefined)

    const { copyText } = await loadClipboard()

    await expect(copyText("x")).resolves.toBe(false)
  })
})
