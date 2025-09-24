import { IntToString } from '@finnoto/core';
import { cn, StackedProgressBar, Tooltip } from '@finnoto/design-system';

interface BroadcastData {
    attributes?: {
        total?: number | string;
        sent?: number | string;
        error?: number | string;
    };
    total?: number | string;
    sent?: number | string;
    error?: number | string;
}

interface MultiColorBroadcastComponentProps {
    data: BroadcastData | null | undefined;
}

export const MultiColorBroadcastComponent = ({
    data,
}: MultiColorBroadcastComponentProps) => {
    // Enhanced error handling and data extraction
    if (!data) return '-';

    const attrs = data?.attributes ?? data;
    if (!attrs || typeof attrs !== 'object') return '-';

    // Safe number conversion with fallbacks
    const total = Math.max(0, Number(attrs?.total) || 0);
    const sent = Math.max(0, Number(attrs?.sent) || 0);
    const error = Math.max(0, Number(attrs?.error) || 0);

    // Early return if no meaningful data
    if (total === 0) return '-';

    const pending = Math.max(0, total - (sent + error));

    // Lighter, more subtle colors
    const segments = [
        { key: 'pending', value: pending, color: '#FCD34D' }, // light amber
        { key: 'sent', value: sent, color: '#86EFAC' }, // light green
        { key: 'error', value: error, color: '#FCA5A5' }, // light red
    ].filter((segment) => segment.value > 0); // Only show segments with values

    // If no segments to show, return dash
    if (segments.length === 0) return '-';

    const progresses = segments.map((s) => s.value);
    const colors = segments.map((s) => s.color);

    // Constants for better maintainability
    const MIN_WIDTH_TO_SHOW_VALUE = 40;
    const PARENT_MIN_WIDTH = 220;

    return (
        <div
            className={cn('relative')}
            style={{
                minWidth: PARENT_MIN_WIDTH,
                maxWidth: 300,
                width: '100%',
            }}
        >
            <StackedProgressBar progresses={progresses} colors={colors} />
            <div className='absolute inset-0 row-flex'>
                {segments.map(({ key, value }, idx) => {
                    const widthPct = Math.round((value / total) * 100);

                    // Calculate segment width in pixels for text visibility
                    const segmentPxWidth = (widthPct / 100) * PARENT_MIN_WIDTH;
                    const shouldShowText =
                        segmentPxWidth >= MIN_WIDTH_TO_SHOW_VALUE;

                    // Capitalize first letter of key for display
                    const displayKey =
                        key.charAt(0).toUpperCase() + key.slice(1);
                    const tooltipMessage = `${displayKey}: ${IntToString(
                        value
                    )}`;

                    return (
                        <Tooltip message={tooltipMessage} key={`${key}-${idx}`}>
                            <div
                                style={{
                                    width: `${widthPct}%`,
                                }}
                                className={cn(
                                    idx === 0 && 'rounded-l',
                                    idx === segments.length - 1 && 'rounded-r',
                                    'h-full centralize text-[10px] font-medium text-gray-700'
                                )}
                            >
                                {shouldShowText ? IntToString(value) : null}
                            </div>
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );
};
