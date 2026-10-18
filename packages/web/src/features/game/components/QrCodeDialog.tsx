import CopyJoinLink from "@razzia/web/features/game/components/CopyJoinLink"
import { useOnClickOutside } from "@razzia/web/hooks/useOnClickOutside"
import { X } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { AlertDialog, VisuallyHidden } from "radix-ui"
import { type ReactNode, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

interface Props {
  webUrl: string
  inviteCode: string
  triggerLabel: string
  triggerClassName?: string
  children: ReactNode
}

const QrCodeDialog = ({
  webUrl,
  inviteCode,
  triggerLabel,
  triggerClassName,
  children,
}: Props) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useOnClickOutside({ ref: contentRef, handler: () => setOpen(false) })

  const joinUrl = `${webUrl}?pin=${inviteCode}`

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger
        aria-label={triggerLabel}
        className={triggerClassName}
      >
        {children}
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <AlertDialog.Content
          ref={contentRef}
          className="fixed top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl bg-white p-6"
        >
          <VisuallyHidden.Root>
            <AlertDialog.Title>{triggerLabel}</AlertDialog.Title>
          </VisuallyHidden.Root>

          <button
            onClick={() => setOpen(false)}
            aria-label={t("common:close")}
            className="hover:bg-muted absolute -top-3 -right-3 rounded-full bg-white p-1.5 shadow-md"
          >
            <X className="text-foreground size-6" />
          </button>

          <QRCodeSVG
            className="size-56 md:size-70 lg:size-95"
            value={joinUrl}
          />

          <p className="text-5xl font-extrabold tabular-nums">{inviteCode}</p>

          <div className="flex items-center gap-2">
            <span className="max-w-md text-lg font-extrabold break-all">
              {webUrl}
            </span>
            <CopyJoinLink url={joinUrl} />
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default QrCodeDialog
