import {useEffect, useSyncExternalStore} from 'react';

import {useSettingsStore} from '../settings/useSettings';

import {REDUCED_MOTION_QUERY, resolveMotion, ResolvedMotion, systemPrefersReducedMotion} from './motionPreference';

const subscribeToSystemMotion = (onChange: () => void): (() => void) => {
    if (typeof window.matchMedia !== 'function') {
        return () => {};
    }
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
};

/** The motion level to use right now: the player's setting, or the operating system's when set to "system". */
export const useResolvedMotion = (): ResolvedMotion => {
    const preference = useSettingsStore((state) => state.motionPreference);
    const systemPrefersReduced = useSyncExternalStore(subscribeToSystemMotion, systemPrefersReducedMotion);
    return resolveMotion(preference, systemPrefersReduced);
};

/** Applies the resolved motion level to <html data-motion="..."> so CSS can respond to it. Call once, in App. */
export const useMotion = (): ResolvedMotion => {
    const motion = useResolvedMotion();

    useEffect(() => {
        document.documentElement.dataset['motion'] = motion;
    }, [motion]);

    return motion;
};
