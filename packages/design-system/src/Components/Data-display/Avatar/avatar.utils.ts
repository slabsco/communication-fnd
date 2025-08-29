/**
 * Get Initials from name/any strings.
 *
 * @param value stirng
 * @returns string
 */
export const GetInitials = (value: string) => {
    if (!value) return '';
    if (value.length === 1) return value;

    const rgx = new RegExp(/\b(\p{L})/gu);
    const initials = [...((value?.matchAll(rgx) as any) || [])];

    return (
        (initials.shift()?.[1] || '') + (initials.shift()?.[1] || '')
    ).toUpperCase();
};
