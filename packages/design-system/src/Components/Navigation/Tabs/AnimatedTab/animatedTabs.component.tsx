'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'react-use';

import { cn } from '../../../../Utils/common.ui.utils';
import { Icon } from '../../../Data-display/Icon/icon.component';
import { IconButton } from '../../../Inputs/Icon-Button/iconButton.component';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tab.core';
import { isCurrentActive } from '../tab.utils';
import { useTabs } from '../useTab.hook';
import {
    aniamtedTabsAppreanceType,
    AnimatedTabsProps,
} from './animatedTabs.type';

import { ArrowRightSvgIcon } from 'assets';

/**
 *
 * @author Saurav Nepal
 *
 * @description Animated tab component
 * @returns
 */
export const AnimatedTabs = ({
    appreance = 'neutral', // Default appearance is 'neutral',
    contentContainerClass, // Custom Class Name for the content container,
    containerClassName, // Parent Container class
    tabListClassName,
    middleSeparator,
    triggerClassName,
    disableSwitch,
    onTabClick,
    rightComponent,
    ...props
}: AnimatedTabsProps) => {
    const { width } = useWindowSize(); // Getting Screen width.
    const { tabs, onChangeTab, active, isComponentRendered } = useTabs(props); // Custom hook for managing tabs

    const activeRef = useRef(null); // Ref for the active tab.
    const tabListsRef = useRef(null); // Ref for the tab list container.

    const [activePosition, setActivePosition] = useState(null); // State for tracking the active tab position to add animation.
    const [hasScrollBar, setHasScrollBar] = useState(false); // State for tracking scrollbar presence

    // Function to handle the change of position of active tab
    const setPosition = (target: any) => {
        setActivePosition({
            height: target?.clientHeight,
            width: target?.clientWidth,
            left: target?.offsetLeft,
        });
    };

    // Function to handle Scroll bar behavior
    const setScrollbar = useCallback((node: any) => {
        node?.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
        });
    }, []);

    // Function to handle left arrowclick, this will scroll the tabitems to the 1st tab.
    const onClickToLeftArrow = () => {
        setScrollbar(tabListsRef.current.children[1]);
    };

    // Function to handle right arrowclick, this will scroll the tabitems to the last tab.
    const onClickToRightArrow = () => {
        setScrollbar(tabListsRef.current.lastChild);
    };

    // Handeling the sideeffect of the component
    useEffect(() => {
        if (!activeRef) return null;
        setPosition(activeRef.current);
        setScrollbar(activeRef?.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    // handeling the state whether the tab container has scroller or not
    useEffect(() => {
        const current = tabListsRef?.current;
        if (current.clientWidth >= current.scrollWidth) {
            setHasScrollBar(false);
        } else {
            setHasScrollBar(true);
        }
    }, [width]);

    return (
        <Tabs
            className={cn('gap-2 bg-transparent col-flex', containerClassName)}
            value={active}
        >
            <div
                className={cn(
                    'flex items-center rounded border border-base-300 bg-base-100',
                    tabListClassName
                )}
            >
                {hasScrollBar && (
                    <IconButton
                        className='mr-2'
                        size='sm'
                        appearance='ghost'
                        icon={ArrowRightSvgIcon}
                        iconClass='rotate-180 text-primary'
                        onClick={onClickToLeftArrow}
                    />
                )}
                <TabsList
                    ref={tabListsRef}
                    className='flex overflow-x-auto overflow-y-hidden relative flex-1 gap-3 p-1 scrollbar-none'
                >
                    {isComponentRendered && (
                        <div
                            style={{
                                width: `${activePosition?.width}px`,
                                height: `${activePosition?.height}px`,
                                left: `${activePosition?.left}px`,
                            }}
                            className={cn(
                                `absolute rounded opacity-100 transition-all duration-200`,
                                aniamtedTabsAppreanceType[appreance]
                            )}
                        ></div>
                    )}

                    {tabs.map((value) => {
                        return (
                            <TabsTrigger
                                ref={
                                    isCurrentActive(active, value.key)
                                        ? activeRef
                                        : null
                                }
                                key={value.key}
                                value={value.key}
                                onClick={() => {
                                    onTabClick?.(value.key);
                                    !disableSwitch && onChangeTab?.(value.key);
                                }}
                                className={cn(
                                    'animated__tab',
                                    triggerClassName,
                                    isCurrentActive(active, value.key)
                                        ? 'animated__tab--active'
                                        : 'animated__tab--inactive',
                                    {
                                        'flex items-center gap-1': value.icon,
                                    }
                                )}
                            >
                                {value?.icon && (
                                    <Icon isSvg source={value.icon} size={18} />
                                )}
                                {value.title}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
                {hasScrollBar && (
                    <IconButton
                        className='ml-2'
                        size='sm'
                        appearance='ghost'
                        icon={ArrowRightSvgIcon}
                        iconClass='text-primary'
                        onClick={onClickToRightArrow}
                    />
                )}
                {rightComponent}
            </div>
            {middleSeparator}
            {tabs.map((value) => {
                if (!value.component) return null;

                return (
                    <TabsContent
                        className={cn(
                            'h-full bg-base-100 p-4 rounded ',
                            contentContainerClass,
                            value.className
                        )}
                        key={value.key}
                        value={value.key}
                    >
                        {value.component}
                    </TabsContent>
                );
            })}
        </Tabs>
    );
};
