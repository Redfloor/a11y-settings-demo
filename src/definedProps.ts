export type DefinedProps<T> = { [K in keyof T]?: Exclude<T[K], undefined> };

/**
 * Drops keys whose value is undefined, so optional props are only passed when they have a value.
 *
 * Usage: <AchievementBlock {...definedProps({progressMax: achievement.progressMax})}/>
 */
export const definedProps = <T extends object>(props: T): DefinedProps<T> => {
    const result: Partial<Record<keyof T, unknown>> = {};
    for (const key of Object.keys(props) as (keyof T)[]) {
        if (props[key] !== undefined) {
            result[key] = props[key];
        }
    }
    return result as DefinedProps<T>;
};
