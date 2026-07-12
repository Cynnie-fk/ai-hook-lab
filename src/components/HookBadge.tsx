export function HookBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 text-xs rounded-full bg-accent-purple/15 text-accent-purple border border-accent-purple/20">
      {tag}
    </span>
  )
}
