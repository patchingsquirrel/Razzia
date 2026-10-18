import Tooltip from "@razzia/web/components/Tooltip"
import { copyText } from "@razzia/web/lib/clipboard"
import clsx from "clsx"
import { Check, Copy } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

interface Props {
  url: string
  className?: string
}

const CopyJoinLink = ({ url, className }: Props) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  const handleCopy = async () => {
    if (!(await copyText(url))) {
      return
    }

    setCopied(true)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopied(false), 1500)
  }

  const label = t(copied ? "game:joinLinkCopied" : "game:copyJoinLink")

  return (
    <Tooltip content={label}>
      <button
        type="button"
        onClick={() => void handleCopy()}
        aria-label={label}
        className={clsx("flex items-center justify-center", className)}
      >
        {copied ? (
          <Check className="size-5 text-green-600" />
        ) : (
          <Copy className="size-5" />
        )}
      </button>
    </Tooltip>
  )
}

export default CopyJoinLink
