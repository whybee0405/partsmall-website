import type { ComponentType } from 'react'
import {
  Disc,
  Engine,
  Lightning,
  SteeringWheel,
  Funnel,
  Gear,
  Thermometer,
  GasPump,
  CarProfile,
  CircleDashed,
  Stack,
  Link as LinkIcon,
  Toolbox,
} from '@phosphor-icons/react/dist/ssr'

type Glyph = ComponentType<{
  size?: number
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  className?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}>

/**
 * Category icons.
 *
 * Only the thirteen glyphs actually used are imported, so the icon library
 * never ships whole. One family, one weight, one size token, per the design
 * system. Nothing here is a hand-drawn SVG path.
 */
const ICONS: Record<string, Glyph> = {
  Disc,
  Engine,
  Lightning,
  SteeringWheel,
  Funnel,
  Gear,
  Thermometer,
  GasPump,
  CarProfile,
  CircleDashed,
  Stack,
  Link: LinkIcon,
  Toolbox,
}

export function CategoryIcon({
  name,
  size = 22,
  className = '',
}: {
  name: string
  size?: number
  className?: string
}) {
  const Glyph = ICONS[name] ?? Gear
  return <Glyph size={size} weight="regular" className={className} aria-hidden="true" />
}
