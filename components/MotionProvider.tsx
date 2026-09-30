'use client'

import { MotionConfig } from 'framer-motion'

/**
 * Tells every framer-motion animation on the site to follow the visitor's
 * "reduce motion" setting: movement and scaling are dropped, fades stay.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
