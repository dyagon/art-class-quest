import { getScene } from '../game/scenes'

type SceneBackdropProps = {
  sceneId: string
  className?: string
}

export function SceneBackdrop({ sceneId, className = '' }: SceneBackdropProps) {
  const scene = getScene(sceneId)
  const hasImage = Boolean(scene.imageSrc)

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: scene.placeholderColor }}
    >
      {hasImage ? (
        <img src={scene.imageSrc} alt={scene.name} className="absolute inset-0 h-full w-full object-cover object-center" />
      ) : (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 25%, rgba(255,255,255,0.28), transparent 36%),
              radial-gradient(circle at 76% 70%, rgba(0,0,0,0.16), transparent 42%)
            `,
          }}
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-black/10" />
      <span className="absolute bottom-2 left-3 rounded-full bg-black/25 px-2 py-0.5 text-[11px] tracking-wide text-white/90 backdrop-blur-sm">
        {scene.name}
      </span>
    </div>
  )
}
