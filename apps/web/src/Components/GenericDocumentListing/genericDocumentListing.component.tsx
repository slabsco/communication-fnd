import { endOfDay, format, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import { formatQuery } from 'react-querybuilder/formatQuery';

import {
    AccessNestedObject,
    API_DATE_TIME_FORMAT,
    APIDateFormat,
    convertGMTToUTCDateTime,
    GetDateValue,
    GetObjectFromArray,
    IsEmptyArray,
    IsEmptyObject,
    IsFunction,
    IsUndefinedOrNull,
    Navigation,
    TitleRoutePayload,
    useApp,
    useGenericDocumentListing,
    useLocalSearch,
} from '@finnoto/core';
import {
    ArcBreadcrumbs,
    ArcPagination,
    Breadcrumbs,
    Button,
    cn,
    Container,
    DatePicker,
    DebugConfigurationButton,
    Icon,
    IconButton,
    IndexFilter,
    Table,
    useFilterContext,
    withFilterProviderExport,
} from '@finnoto/design-system';
import { RightClickRowOptionProps } from '@finnoto/design-system/src/Components/Inputs/RightClick/rightClick.types';

import ArcToggleListingButtonGroup from '@Components/ArcGenericCardListing/arc.toggle.listing.button.group.component';
import DropdownActionButton from '@Components/DropdownButton/dropdown.action.button';
import { openCommonKeyValueList } from '@Utils/functions.utils';

import OuterFilterList from './Components/outerFilter.list.component';
import { GenericDocumentListingProps } from './genericDocumentListing.types';

import { CalendarSvgIcon, DownloadChartSvgIcon } from 'assets';

const GenericDocumentListing = ({
    name,
    type,
    tableNumbering = true,
    table,
    tabs,
    filters,
    searchFilter,
    dateFilter = false,
    amountFilter = false,
    hideFilter,
    disableNetworkCall,
    rowActions,
    actions = [],
    customBreadcrumbData,
    showViewFilter = false,
    dashboardComponent,
    defaultActiveTab,
    defaultDbSort,
    firstRowIcon,
    preferences = {},
    tableClass,
    disableAggregation,
    searchMethod = 'list',
    tabFilterKey = 'approval',
    handleSelectedData = () => {},
    customNoData,
    selectableActionButton,
    defaultClassParams,
    definitionKey,
    asInnerTable = false,
    renderRightFilterComponent,
    renderRightActionComponent,
    enableCsvDownload = true,
    removeReportDate,
    showOuterDate,
    searchMethodParams,
    isSNclickAble = false,
    allColumns,
    tableWrapperClassName,
    hideSaveFilter,
    hideDisplayFilterKeys,
    onlyDisplayQueryFilter,
    splitDetailRoute,
    containerClassName,
    tableType = 'normal',
    renderMiddleComponent,
    hidePagination,
    withLegacyFilter,
    renderContentBeforeTable,
    sanitizeFilter,
    filterTitle,
    ...props
}: GenericDocumentListingProps) => {
    const { basePath, isArc: isArcPortal } = useApp();
    const { filterQuery, queryString, clearAllFilter } = useFilterContext();

    const { saved_filter } = queryString || {};

    const tabFilter = useMemo(
        () => queryString[tabFilterKey] || saved_filter || defaultActiveTab,
        [defaultActiveTab, queryString, saved_filter, tabFilterKey]
    );

    const tabFilterData = useMemo(() => {
        if (!tabFilter || tabFilter === 'all' || saved_filter) {
            return undefined;
        }
        const activeTab = GetObjectFromArray(tabs, 'key', tabFilter);
        if (activeTab?.customFilterValue) {
            return activeTab.customFilterValue;
        }

        return { [tabFilter]: true };
    }, [saved_filter, tabFilter, tabs]);

    const {
        loading,
        filterData,
        records,
        pagination,
        tableFilters,
        handleFilterData,
        removeFilterData,
        handleNavigationSearch,
        setPagination,
        aggregate,
        handleStatus,
        createQuery,
        downloadCsv,
    } = useGenericDocumentListing(type, {
        dateFilter,
        amountFilter,
        disableNetworkCall,
        defaultDbSort,
        showViewFilter,
        searchMethod,
        searchFilter,
        tabFilterKey,
        tabFilterData,
        defaultClassParams,
        filters,
        definitionKey,
        name,
        removeReportDate,
        searchMethodParams,
        sanitizeFilter,
    });

    const {
        searchQuery,
        setSearchQuery,
        searchResult: localSearchRecords,
    } = useLocalSearch(
        records,
        (searchFilter !== false && searchFilter?.localSearchAttrs) || ''
    );

    const showAddAction = useMemo(
        () =>
            (!queryString?.[tabFilterKey] && !queryString?.saved_filter) ||
            ['all', 'active', 'open'].includes(queryString?.[tabFilterKey]),
        [queryString, tabFilterKey]
    );

    const arcBreadcrumbActions = useMemo(() => {
        if (IsEmptyArray(props.arcBreadcrumbActions)) return [];
        if (showAddAction) return props.arcBreadcrumbActions;
        return props.arcBreadcrumbActions?.filter(
            (action) => action.type !== 'create'
        );
    }, [props.arcBreadcrumbActions, showAddAction]);

    const sanitizeActions = useMemo(() => {
        if (IsEmptyArray(actions)) return [];
        if (showAddAction) return actions;
        return actions?.filter((action) => action.type !== 'create');
    }, [actions, showAddAction]);

    const { container, selectable } = preferences;

    const breadcrumbData: Array<TitleRoutePayload> = [
        {
            name: 'Home',
            link: basePath,
            className: 'text-base-tertiary',
        },
        {
            name,
            className: 'text-base-primary',
        },
    ];

    const enableDownLoadIcon = useMemo(() => {
        if (enableCsvDownload && !IsEmptyArray(records)) {
            return true;
        }
        return false;
    }, [enableCsvDownload, records]);

    const contextActions: RightClickRowOptionProps[] = useMemo(
        () => [
            {
                name: 'Show Matching',
                onClick: ({ column, rowData }) => {
                    const query = {
                        field: column.filter_identifier || column.key,
                        operator: '=',
                        value: AccessNestedObject(
                            rowData,
                            column.filter_identifier || column.key
                        ),
                    };
                    if (IsFunction(column?.getRightClickCustomQuery)) {
                        const newQuery =
                            column.getRightClickCustomQuery(rowData);
                        if (newQuery?.field && newQuery?.value) {
                            query.field = newQuery?.field;
                            query.value = newQuery.value;
                        }
                    }

                    if (IsUndefinedOrNull(query.value)) {
                        delete query.value;
                        query.operator = 'null';
                    }

                    handleNavigationSearch(
                        {
                            filter_query: formatQuery(
                                createQuery(query, true, filterQuery),
                                'json_without_ids'
                            ),
                            filter: JSON.stringify({
                                ...filterData,
                                page: 1,
                                limit: pagination?.limit || 20,
                            }),
                        },
                        false
                    );
                },
            },
            {
                name: 'Filter Out',
                onClick: ({ column, rowData }) => {
                    const query = {
                        field: column.filter_identifier || column.key,
                        operator: '!=',
                        value: AccessNestedObject(
                            rowData,
                            column.filter_identifier || column.key
                        ),
                    };
                    if (IsFunction(column?.getRightClickCustomQuery)) {
                        const newQuery =
                            column.getRightClickCustomQuery(rowData);
                        if (newQuery?.field && newQuery?.value) {
                            query.field = newQuery?.field;
                            query.value = newQuery.value;
                        }
                    }

                    if (IsUndefinedOrNull(query.value)) {
                        delete query.value;
                        query.operator = 'notNull';
                    }
                    handleNavigationSearch(
                        {
                            filter_query: formatQuery(
                                createQuery(query, false, filterQuery),
                                'json_without_ids'
                            ),
                            filter: JSON.stringify({
                                ...filterData,
                                page: 1,
                                limit: pagination?.limit || 20,
                            }),
                        },
                        false
                    );
                },
            },
            {
                name: 'Aggregation',
                visible: ({ column }) =>
                    !disableAggregation &&
                    !column.disableAggregation &&
                    ['number', 'currency', 'date', 'date_time'].includes(
                        column.type
                    ),
                actions: [
                    {
                        name: 'Sum',
                        visible: ({ column }) =>
                            ['number', 'currency'].includes(column.type),
                        onClick: aggregate().sum,
                    },
                    {
                        name: 'Avg',
                        visible: ({ column }) =>
                            ['number', 'currency'].includes(column.type),
                        onClick: aggregate().avg,
                    },
                    {
                        name: 'Min',
                        onClick: aggregate().min,
                    },
                    {
                        name: 'Max',
                        onClick: aggregate().max,
                    },
                ],
            },
            {
                name: 'Divider',
            },
            {
                name: 'Clear Filter',
                disabled: !queryString.filter_query,
                className: 'text-error',
                onClick: () => {
                    delete queryString.filter_query;

                    handleNavigationSearch(queryString, false, { reset: true });
                },
            },
        ],
        [
            aggregate,
            createQuery,
            disableAggregation,
            filterData,
            filterQuery,
            handleNavigationSearch,
            pagination?.limit,
            queryString,
        ]
    );

    // TODO: Check this, is it needed?
    // const clearPaginationOnTabChange = useCallback(
    //     (key: string) => {
    //         let jsonObject = JSON.parse(queryString.filter || '{}');
    //         if (jsonObject?.page) {
    //             jsonObject.page = 1;
    //             queryString.filter = JSON.stringify(jsonObject);
    //             Navigation.search({
    //                 ...queryString,
    //                 [tabFilterKey]: key,
    //             });
    //         }
    //     },
    //     [queryString, tabFilterKey]
    // );

    const dataNotFoundContent = useMemo(() => {
        let addAction = GetObjectFromArray(sanitizeActions, 'type', 'create');
        if (!addAction) {
            addAction = GetObjectFromArray(sanitizeActions, 'type', 'icon_btn');
        }

        if (isArcPortal) {
            let arcAddAction = GetObjectFromArray(
                arcBreadcrumbActions,
                'type',
                'create'
            );

            if (!arcAddAction) {
                arcAddAction = GetObjectFromArray(
                    arcBreadcrumbActions,
                    'type',
                    'icon_btn'
                );
            }

            if (arcAddAction) addAction = arcAddAction;
        }

        let noData = {
            title: `No Data Found`,
            description: !!addAction
                ? `To add a new ${name}, click on the button below`
                : '',
            button: {
                name: addAction?.name,
                onClick: addAction?.action || null,
            },
            enableAddNew: !!addAction?.visible,
            name,
        };

        if (isArcPortal) {
            noData.title = `Looks like there are no ${name.toLowerCase()} here`;
            noData.button.name = name;
            noData.enableAddNew = IsUndefinedOrNull(addAction?.visible)
                ? true
                : !!addAction?.visible;
        }

        if (!noData.button?.onClick) {
            noData.enableAddNew = false;
            delete noData.button;
        }
        return {
            ...noData,
            ...(customNoData || {}),
        };
    }, [
        arcBreadcrumbActions,
        customNoData,
        isArcPortal,
        name,
        sanitizeActions,
    ]);

    const isLocalSearchEnabled = useMemo(() => {
        if (!searchFilter) return false;
        if (!searchFilter.local) return false;

        if (filterData?.search?.length) return false;

        return true;
    }, [filterData?.search?.length, searchFilter]);

    const firstRecord = useMemo(() => {
        if (isLocalSearchEnabled) return localSearchRecords?.[0];
        return records?.[0];
    }, [isLocalSearchEnabled, localSearchRecords, records]);

    const splitDetailUrl = useMemo(() => {
        if (!splitDetailRoute) return null;
        return `${splitDetailRoute}/${firstRecord?.id}`;
    }, [firstRecord?.id, splitDetailRoute]);

    const sort = useMemo(() => {
        const order = filterData?.order;
        if (!order) return {};
        if (IsEmptyObject(order)) return {};

        return {
            column: Object.keys(order)[0],
            order: Object.values(order)[0] as any,
        };
    }, [filterData?.order]);

    return (
        <Container
            offContainer={container || asInnerTable}
            className={cn(
                'relative col-flex p-4 overflow-hidden h-full print:bg-transparent ap-container generic-document-listing',
                asInnerTable && '!px-0',
                containerClassName
            )}
            pageTitle={name}
        >
            <div
                className={cn(
                    'relative flex-1 gap-3 col-flex print:p-0',
                    {
                        'gap-2': isArcPortal,
                    },
                    tableWrapperClassName
                )}
            >
                {!asInnerTable && (
                    <>
                        {!isArcPortal ? (
                            <div className='flex justify-between items-center'>
                                <Breadcrumbs
                                    title={name}
                                    route={
                                        customBreadcrumbData || breadcrumbData
                                    }
                                />
                                <div className='flex gap-4 items-center'>
                                    <OuterFilterList
                                        {...{
                                            filterData,
                                            listFilters: tableFilters,
                                            handleFilterData,
                                        }}
                                    />
                                    {renderRightActionComponent}
                                    {!IsEmptyArray(sanitizeActions) && (
                                        <div className='col-flex'>
                                            <div className='flex-wrap gap-4 justify-end row-flex'>
                                                {renderListingActionButton(
                                                    sanitizeActions,
                                                    records
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <ArcBreadcrumbs
                                title={name}
                                route={customBreadcrumbData || breadcrumbData}
                                rightComponent={
                                    <div className='flex gap-2'>
                                        <OuterFilterList
                                            {...{
                                                filterData,
                                                listFilters: tableFilters,
                                                handleFilterData,
                                            }}
                                        />
                                        {renderListingActionButton(
                                            arcBreadcrumbActions,
                                            records
                                        )}
                                    </div>
                                }
                            />
                        )}
                    </>
                )}
                {IsFunction(renderContentBeforeTable)
                    ? renderContentBeforeTable({
                          clearAllFilter,
                      })
                    : renderContentBeforeTable}
                <TabTableWrapper
                    tabs={tabs}
                    tabTableWrapperClass={cn(tableWrapperClassName)}
                >
                    <DebugConfigurationButton
                        slug={defaultClassParams?.slug}
                        position='topleft'
                    />
                    <IndexFilter
                        className='mb-2 rounded-lg border'
                        filters={filters}
                        filterTabs={tabs}
                        defaultActiveTab={defaultActiveTab || 'all'}
                        definitionKey={definitionKey}
                        tabFilterQueryKey={tabFilterKey}
                        onlyDisplayQueryFilter={onlyDisplayQueryFilter}
                        searchString={
                            isLocalSearchEnabled
                                ? searchQuery || ''
                                : filterData?.search || ''
                        }
                        filterTitle={filterTitle}
                        searchFilter={searchFilter}
                        hideFilter={hideFilter}
                        hideSaveFilter={hideSaveFilter}
                        rightTabContent={
                            <div className='flex gap-2 items-center'>
                                {renderRightFilterComponent}

                                {/* {enableDownLoadIcon && (
                                    <IconButton
                                        onClick={downloadCsv}
                                        icon={DownloadChartSvgIcon}
                                        name='Download CSV'
                                        size='sm'
                                        outline
                                        appearance={
                                            isArcPortal
                                                ? 'polaris-white'
                                                : 'primary'
                                        }
                                    />
                                )} */}
                            </div>
                        }
                        onSearchChange={(value) => {
                            if (!value.length) {
                                removeFilterData('search');
                                setSearchQuery('');
                                return;
                            }
                            if (isLocalSearchEnabled) {
                                return setSearchQuery(value);
                            }
                            if (value.length >= 3) {
                                handleFilterData({
                                    search: value,
                                });
                            }
                        }}
                        withLegacyFilter={withLegacyFilter}
                    />
                    <div className={cn('overflow-y-auto h-full', tableClass)}>
                        {tableType === 'normal' && (
                            <Table
                                rowAction={{
                                    display:
                                        IsFunction(rowActions) ||
                                        rowActions?.some(
                                            (action) => action.visible !== false
                                        ),
                                    menuActions: rowActions,
                                }}
                                contextActions={contextActions}
                                data={
                                    isLocalSearchEnabled
                                        ? localSearchRecords
                                        : records
                                }
                                isHideSummary
                                column={table}
                                rowNumbering={tableNumbering}
                                openSnModal={(data) => {
                                    if (!data) return null;
                                    openCommonKeyValueList({
                                        title: name,
                                        isDefination: true,
                                        queryFn: async () => {
                                            return {
                                                column: allColumns,
                                                data: data,
                                            };
                                        },
                                        handleStatus: handleStatus,
                                    });
                                }}
                                showToltip={true}
                                pagination={{
                                    display: !hidePagination,
                                    pagination,
                                    onPaginationChange: setPagination,
                                }}
                                sorting={{
                                    sorting: {
                                        column: sort.column,
                                        order: sort.order || 'asc',
                                    },
                                    onSortingChange: ({ column, order }) => {
                                        handleFilterData({
                                            order: { [column]: order },
                                        });
                                    },
                                }}
                                select={{
                                    display: selectable,
                                    handleSelectedData,
                                }}
                                loading={loading}
                                preferences={{
                                    appreance: 'neutral',
                                    fullHeight: true,
                                    roundedCorners: true,
                                    // stickyHeader: true,
                                    ...preferences,
                                }}
                                noDataFound={dataNotFoundContent}
                                handleStatus={(
                                    id: number,
                                    isActive?: boolean,
                                    method?: string,
                                    callback?: (data?: any) => void
                                ) => {
                                    handleStatus(
                                        id,
                                        isActive,
                                        method || 'activate',
                                        callback
                                    );
                                }}
                            />
                        )}
                        {tableType === 'card' && (
                            <CardViewTable
                                data={
                                    isLocalSearchEnabled
                                        ? localSearchRecords
                                        : records
                                }
                                onPaginationChange={setPagination}
                                pagination={pagination}
                                renderMiddleComponent={renderMiddleComponent}
                            />
                        )}
                    </div>
                </TabTableWrapper>
                {/* )} */}
            </div>
        </Container>
    );
};

export const TableDateFilter = ({
    filterData,
    handleFilterData,
}: {
    filterData: any;
    handleFilterData: (key: string, value: any) => void;
}) => {
    const startDate = useMemo(() => {
        const date = GetDateValue(filterData.date?.range?.min);
        if (!date) return date;
        return startOfDay(date);
    }, [filterData.date?.range?.min]);
    const endDate = useMemo(() => {
        const date = GetDateValue(filterData.date?.range?.max);
        if (!date) return date;
        return endOfDay(convertGMTToUTCDateTime(date));
    }, [filterData.date?.range?.max]);

    return (
        <DatePicker
            rangeSelector
            withRangeSelect
            value={{
                startDate: startDate,
                endDate: endDate,
            }}
            onRangeSelect={(range) => {
                handleFilterData('date', {
                    range: {
                        min: APIDateFormat({
                            date: range.startDate,
                            format: API_DATE_TIME_FORMAT,
                        }),
                        max: APIDateFormat({
                            date: range.endDate,
                            format: API_DATE_TIME_FORMAT,
                        }),
                    },
                });

                // CloseAllPoppers();
            }}
            offsetY={-38}
        >
            {IsEmptyObject(filterData.date?.range) ? (
                <div className=' bg-base-100 border border-primary cursor-pointer rounded px-2 py-[7px]'>
                    <Icon
                        source={CalendarSvgIcon}
                        className={'text-primary'}
                        size={20}
                        isSvg
                    />
                </div>
            ) : (
                <div className='rounded border cursor-pointer select-none row-flex bg-base-100'>
                    <div className='flex px-4 py-2'>
                        <div className='flex items-center text-sm whitespace-nowrap text-base-primary pt-3/2'>
                            {!IsEmptyObject(filterData.date?.range) &&
                                format(
                                    GetDateValue(filterData.date?.range?.min),
                                    'MMM dd, yyyy'
                                )}{' '}
                            <span className='px-2 font-normal text-base-tertiary'>
                                to
                            </span>
                            {!IsEmptyObject(filterData.date?.range) &&
                                format(
                                    convertGMTToUTCDateTime(
                                        GetDateValue(
                                            filterData.date?.range?.max
                                        )
                                    ),
                                    'MMM dd, yyyy'
                                )}
                        </div>
                    </div>
                    <div className='px-2 my-2 border-l'>
                        <Icon
                            source={CalendarSvgIcon}
                            className={'text-primary'}
                            size={24}
                            isSvg
                        />
                    </div>
                </div>
            )}
        </DatePicker>
    );
};

const TabTableWrapper = ({ children, tabs, tabTableWrapperClass }: any) => {
    if (!tabs?.length)
        return (
            <div className={cn('h-full col-flex', tabTableWrapperClass)}>
                {children}
            </div>
        );
    return <div className='h-full col-flex'>{children}</div>;
};

export const renderListingActionButton = (actions, records?: any) => {
    if (IsEmptyArray(actions)) return null;

    return actions?.map((value: any, index) => {
        if (IsFunction(value?.visible) && !value?.visible(records)) return null;
        if (value?.visible === false) return null;
        switch (value.type) {
            case 'action_btn':
                return (
                    <DropdownActionButton
                        actions={value.buttonActions}
                        size='md'
                    />
                );

            case 'icon_btn':
                return (
                    <IconButton
                        key={index}
                        shape='square'
                        outline={value?.outline}
                        appearance='primary'
                        icon={value?.icon}
                        onClick={() => value.action(null)}
                        name={value?.name}
                        size='md'
                    />
                );
            case 'normal':
                return (
                    <Button
                        key={index}
                        appearance='primary'
                        size='md'
                        onClick={() => value.action(null)}
                        shape={value?.shape}
                        outline={value?.outline}
                        disabled={value?.outline ?? false}
                    >
                        <div className='gap-2 items-center row-flex'>
                            {value?.icon && (
                                <Icon source={value?.icon} size={18} isSvg />
                            )}

                            {value.name}
                        </div>
                    </Button>
                );

            default:
                return (
                    <Button
                        key={value?.key}
                        appearance='primary'
                        size='md'
                        onClick={() => value.action(null)}
                        shape={value?.shape}
                        outline={value?.outline}
                        data-title={value?.key}
                    >
                        <div className='gap-1 items-center row-flex'>
                            {value?.type == 'create' && (
                                <Icon source={'add_circle_outline'} />
                            )}
                            {value.name}
                        </div>
                    </Button>
                );
        }
    });
};

export default withFilterProviderExport(GenericDocumentListing);

export const CardViewTable = ({
    pagination,
    onPaginationChange,
    data,
    renderMiddleComponent,
}) => {
    return (
        <div className='h-full col-flex'>
            <div className='h-full'>
                {renderMiddleComponent && renderMiddleComponent(data)}
            </div>
            <ArcPagination
                pagination={pagination}
                onPaginationChange={onPaginationChange}
            />
        </div>
    );
};
