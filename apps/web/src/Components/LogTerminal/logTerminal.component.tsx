import clsx from 'clsx';
import { format } from 'date-fns';
import { useRef } from 'react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';
import { useFullscreen, useToggle } from 'react-use';

import { IsEmptyArray } from '@finnoto/core';
import { Accordion, Button, Icon, Tooltip } from '@finnoto/design-system';

interface LogTerminalProps {
    items?: LogItem[];
    theme?: ColorMode;
    startBottom?: boolean;
}

export interface LogItem {
    type: 'log' | 'error' | 'warn' | 'message';
    message: string;
    time?: Date;
    filter?: string | null;
    dropdownComponent?: any;
}

const LogTerminal = ({
    items,
    theme = ColorMode.Light,
    startBottom,
}: LogTerminalProps) => {
    const [fullscreen, toggleFullscreen] = useToggle(false);
    const terminalDisplayClass = clsx('terminal-display', {
        'terminal-bottom': startBottom,
    });

    const terminalRef = useRef(null);

    useFullscreen(terminalRef, fullscreen, {
        onClose: () => {
            toggleFullscreen(false);
        },
    });

    return (
        <div
            ref={terminalRef}
            className='log-terminal'
            data-terminal-theme={theme === ColorMode.Dark ? 'dark' : 'light'}
        >
            <div className='justify-between items-center row-flex'>
                <h3 className='mx-3 font-semibold'>
                    This will show the last Last 50 Logs
                </h3>
                <Tooltip message='Fullscreen'>
                    <Button
                        className='!text-current no-animation'
                        appearance='polaris-warning'
                        onClick={() => toggleFullscreen()}
                    >
                        <Icon
                            source={
                                fullscreen ? 'fullscreen_exit' : 'fullscreen'
                            }
                            size={24}
                        />
                    </Button>
                </Tooltip>
            </div>
            <Terminal colorMode={theme}>
                <div className={terminalDisplayClass}>
                    {items &&
                        !IsEmptyArray(items) &&
                        items.map((item, index) => (
                            <LogMessage
                                key={index + item.type + item.time}
                                index={index}
                                data={item}
                            />
                        ))}
                </div>
            </Terminal>
        </div>
    );
};

const LogMessage = ({ data, index }: { data: LogItem; index: number }) => {
    if (data.type === 'message') {
        return (
            <TerminalOutput key={index + data.type + data.time}>
                <div className='terminal-output-wrapper' data-type={data.type}>
                    <span className='terminal-output-type'>[{data.type}]</span>
                    <span className='terminal-output-message'>
                        {data.message}
                    </span>
                </div>
            </TerminalOutput>
        );
    }

    return (
        <TerminalOutput key={index + data.type + data.time}>
            <Accordion
                type='single'
                accordions={[
                    {
                        className: 'p-0 border-b-0 m-0',
                        triggerClassName: 'p-0',
                        title: (
                            <div
                                className='text-base leading-3 terminal-output-wrapper'
                                data-type={data.type}
                            >
                                {data.time ? (
                                    <span className='terminal-output-time'>
                                        {format(
                                            data.time,
                                            'MM/dd/yyyy, hh:mm:ss aa'
                                        )}
                                    </span>
                                ) : null}
                                {'-'}
                                <span className='terminal-output-type'>
                                    [{data.type}] :
                                </span>
                                <span className='terminal-output-message'>
                                    {data.message}
                                </span>
                            </div>
                        ),
                        content: data?.dropdownComponent,
                    },
                ]}
            />
        </TerminalOutput>
    );
};

export default LogTerminal;
