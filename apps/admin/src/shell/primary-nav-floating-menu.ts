export interface HorizontalNavDropdownPositionInput {
  trigger: {
    bottom: number
    left: number
    width: number
  }
  viewportWidth: number
  gap?: number
  preferredWidth?: number
  viewportPadding?: number
}

export interface HorizontalNavDropdownPosition {
  left: number
  top: number
  width: number
}

export function resolveHorizontalNavDropdownPosition({
  trigger,
  viewportWidth,
  gap = 6,
  preferredWidth = 176,
  viewportPadding = 8
}: HorizontalNavDropdownPositionInput): HorizontalNavDropdownPosition {
  const width = Math.min(preferredWidth, Math.max(0, viewportWidth - viewportPadding * 2))
  const centeredLeft = trigger.left + trigger.width / 2 - width / 2
  const maximumLeft = Math.max(viewportPadding, viewportWidth - viewportPadding - width)

  return {
    left: Math.min(Math.max(centeredLeft, viewportPadding), maximumLeft),
    top: trigger.bottom + gap,
    width
  }
}
