export type MotionPreference = 'system' | 'reduced' | 'full';
export type ResolvedMotion = 'reduced' | 'full';

export const motionPreferences: readonly MotionPreference[] = ['system', 'reduced', 'full'];

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const isMotionPreference = (value: unknown): value is MotionPreference =>
    typeof value === 'string' && (motionPreferences as readonly string[]).includes(value);

export const resolveMotion = (preference: MotionPreference, systemPrefersReduced: boolean): ResolvedMotion => {
    if (preference === 'system') {
        return systemPrefersReduced ? 'reduced' : 'full';
    }
    return preference;
};

export const systemPrefersReducedMotion = (): boolean =>
    typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION_QUERY).matches;
