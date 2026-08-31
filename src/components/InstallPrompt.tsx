import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'pwa-install-dismissed'

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  )
}

function isIosSafari() {
  const ua = navigator.userAgent
  const ios = /iphone|ipad|ipod/i.test(ua)
  const safari = /safari/i.test(ua) && !/crios|fxios|edgios|android/i.test(ua)
  return ios && safari
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [iosHint, setIosHint] = useState(false)

  function hide() {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setDeferred(null)
    setIosHint(false)
  }

  useEffect(() => {
    if (isStandalone() || sessionStorage.getItem(DISMISS_KEY)) return

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', hide)

    if (isIosSafari()) setIosHint(true)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', hide)
    }
  }, [])

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    const choice = await deferred.userChoice
    if (choice.outcome === 'accepted') hide()
    else setDeferred(null)
  }

  if (!deferred && !iosHint) return null

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-md items-center gap-3 rounded-2xl bg-[#f4ead4] px-4 py-3 text-[#3c2f26] shadow-2xl ring-1 ring-[#c9b48d]/80">
        <img src="/icon-192.png" alt="" className="size-10 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 text-left">
          <p className="font-display text-sm">安装到桌面</p>
          <p className="text-xs text-[#6b5648]">
            {iosHint ? '点击底部分享按钮，选择「添加到主屏幕」' : '随时打开，像 App 一样上课'}
          </p>
        </div>
        {deferred ? (
          <button
            type="button"
            onClick={() => void install()}
            className="shrink-0 rounded-full bg-[#b23a2f] px-3 py-1.5 text-sm text-white"
          >
            安装
          </button>
        ) : null}
        <button
          type="button"
          onClick={hide}
          className="shrink-0 text-xs text-[#6b5648]"
          aria-label="关闭安装提示"
        >
          稍后
        </button>
      </div>
    </div>
  )
}
