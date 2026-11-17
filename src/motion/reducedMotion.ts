/**
 * styled-components selector for a component's reduced-motion styles, applied while <html data-motion="reduced">
 * (see useMotion). Reduced motion means no movement, scaling, rotation or auto-scrolling; fades and colour changes
 * are fine, so keep feedback visible with those instead of removing it.
 *
 *     ${whenReducedMotion} {
 *         animation: ${pulse} 2s ease-in-out infinite;
 *     }
 */
export const whenReducedMotion = 'html[data-motion="reduced"] &';
