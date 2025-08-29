import Truncate from 'react-truncate';
import { useToggle } from 'react-use';

import { cn } from '../../../Utils/common.ui.utils';
import { EllipsisProps } from './ellipsis.types';

/**
 * Renders text with truncation and optional "Show More" and "Show Less" functionality.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.lines=1] - The number of lines to display before truncation.
 * @param {string|number} [props.width] - The width of the component.
 * @param {string} [props.className] - Additional CSS class for the component.
 * @param {string} [props.showText="Show More"] - The text to display for the "Show More" link.
 * @param {string} [props.hideText="Show Less"] - The text to display for the "Show Less" link.
 * @param {boolean} [props.withShowMore=false] - Determines if the "Show More" functionality should be enabled.
 * @param {any} props.children - The content to be rendered within the component.
 * @returns {JSX.Element} The rendered React component.
 *
 * @author @rumeshudash
 */
export const Ellipsis = ({
    lines = 1,
    width,
    className,
    showText = 'more',
    hideText = 'less',
    withShowMore = false,
    children,
    showTextClassName,
    truncateClassName,
    customShowMore,
}: EllipsisProps) => {
    const [expanded, toggleExpand] = useToggle(false);
    const [truncated, toggleTruncated] = useToggle(false);

    return (
        <div className={cn('w-full', className)}>
            <Truncate
                lines={!expanded && lines}
                width={width}
                ellipsis={
                    withShowMore
                        ? customShowMore || (
                              <span>
                                  …{' '}
                                  <a
                                      className={cn(
                                          'font-medium table-link text-base-primary',
                                          showTextClassName
                                      )}
                                      onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          toggleExpand(true);
                                      }}
                                  >
                                      {showText}
                                  </a>
                              </span>
                          )
                        : undefined
                }
                onTruncate={toggleTruncated}
                trimWhitespace
                className={truncateClassName}
            >
                {children}
            </Truncate>
            {!truncated && expanded && (
                <span>
                    {' '}
                    <a
                        className='font-medium table-link text-base-primary'
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleExpand(false);
                        }}
                    >
                        {hideText}
                    </a>
                </span>
            )}
        </div>
    );
};
