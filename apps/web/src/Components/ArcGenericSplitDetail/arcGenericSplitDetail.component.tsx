import { useMemo, useRef, useState } from 'react';

import {
    ARC_HOME_ROUTE,
    GenericListingType,
    IsEmptyArray,
    useFetchParams,
} from '@finnoto/core';
import {
    AccessNestedObject,
    ArcBreadcrumbs,
    ArcPagination,
    cn,
    IndexFilter,
    IsFunction,
    NoDataFound,
    PageLoader,
    sanitizeFilterData,
    useFilterContext,
    withFilterProviderExport,
} from '@finnoto/design-system';
import { BreadcrumbsProps } from '@finnoto/design-system/src/Components/Navigation/Breadcrumbs/breadcrumbs.types';
import TwinPanel from '@finnoto/design-system/src/Components/Navigation/TwinPanel/twinPanel.component';

import { renderListingActionButton } from '@Components/GenericDocumentListing/genericDocumentListing.component';
import { Slot } from '@radix-ui/react-slot';

import { ArcGenericSplitDetailProps } from './arcGenericSplitDetail.types';

const ArcGenericSplitDetail = (props: ArcGenericSplitDetailProps) => {
    const { id } = useFetchParams();
    const {
        type,
        title,
        definitionKey,
        customBreadCrumbData,
        listContainerClassName,
        listWrapperClassName,
        renderCardItem,
        renderCardLoading,
        renderDetailSection,
        renderListingSection,
        renderRightFilterComponent,
        renderRightActionComponent,
        actions,
        filters,
        cacheTime,
        tabs,
        tabFilterKey = 'tab',
        method,
        detailApiType,
        detailMethod,
        detailMethodParams,
        defaultClassParams,
        defaultActiveTab = 'open',
        isScrollable = true,
        isMoveTop = false,
        isShowPagination = true,
        renderTopBar,
        onListActiveChange,
        arcBreadcrumbActions,
        splitContainerClassName,
        detailContainerClassName,
        withLegacyFilter,
        breadcrumbKey = 'identifier',
    } = props;

    const { tab, queryParams } = useFetchParams();
    const {
        filterData,
        sqlFilterQuery,
        filterJson,
        pagination,
        setPagination,
    } = useFilterContext();

    const tabValue = useMemo(
        () => queryParams[tabFilterKey] || defaultActiveTab,
        [defaultActiveTab, queryParams, tabFilterKey]
    );
    const scrollRef = useRef<HTMLDivElement>(null);

    const breadcrumbData: BreadcrumbsProps = {
        title,
        route: [
            {
                name: 'Home',
                link: ARC_HOME_ROUTE,
            },
            {
                name: title,
            },
        ],
    };

    const tabParams = useMemo(() => {
        if (!tab && !tabValue) return {};

        if (!tabs?.length) return {};
        if (tabValue) {
            return tabs?.find((t) => t.key === tabValue)?.customFilterValue;
        }

        return tabs?.find((t) => t.key === tab)?.customFilterValue || {};
    }, [tab, tabValue, tabs]);

    const { search, ...restFilters } = useMemo(
        () => sanitizeFilterData(filterData),
        [filterData]
    );

    const [details, setDetails] = useState({ name: '', identifier: '' }); // Provide an initial value for 'details'

    const newBreadCrumbData = useMemo(() => {
        return (customBreadCrumbData || breadcrumbData.route)?.concat({
            name: `${
                details?.name ??
                AccessNestedObject(details, breadcrumbKey) ??
                ' '
            }`,
        });
    }, [breadcrumbData.route, breadcrumbKey, customBreadCrumbData, details]);
    return (
        <div className={cn('overflow-hidden px-5 col-flex h-content-screen')}>
            <ArcBreadcrumbs
                mainClassName='rounded py-4 rounded-none pb-2'
                title={title}
                route={newBreadCrumbData}
                rightComponent={
                    <div>{renderListingActionButton(arcBreadcrumbActions)}</div>
                }
            />
            <div
                className={cn(
                    'overflow-y-auto flex-1 gap-2 justify-between py-4 pt-0 col-flex',
                    splitContainerClassName
                )}
            >
                {IsFunction(renderTopBar) ? (
                    renderTopBar()
                ) : (
                    <IndexFilter
                        className='rounded-lg border'
                        filters={filters}
                        filterTabs={tabs}
                        definitionKey={definitionKey}
                        tabFilterQueryKey={tabFilterKey}
                        defaultActiveTab={defaultActiveTab}
                        rightTabContent={
                            <div className='flex gap-2 items-center'>
                                {renderRightFilterComponent}
                                {renderRightActionComponent}
                                {!IsEmptyArray(actions) && (
                                    <div className='col-flex'>
                                        <div className='flex-wrap gap-2 justify-end row-flex'>
                                            {renderListingActionButton(actions)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                        withLegacyFilter={withLegacyFilter}
                    />
                )}

                <TwinPanel
                    cacheTime={cacheTime}
                    containerClassName='flex-1 overflow-hidden'
                    rightContainerClassName={detailContainerClassName}
                    apiConfigurations={{
                        activeId: Number(id),
                        detailMethod: detailMethod,
                        detailApiType: detailApiType as GenericListingType,
                        detailMethodParams,
                        className: type,
                        definitionKey,
                        method,
                        listingClassParams: {
                            search:
                                search && search.length >= 3
                                    ? search
                                    : undefined,
                            ...(defaultClassParams || {}),
                            page: parseInt(pagination?.page + '') || 1,
                            limit: parseInt(pagination?.limit + '') || 20,
                            ...tabParams,
                            ...restFilters,
                            filter_json: filterJson,
                            filter_query: sqlFilterQuery,
                        },
                    }}
                    onDetailData={(detail) => {
                        setDetails(detail);
                        const activeElement = scrollRef.current.querySelector(
                            `[data-id="${id}"]`
                        );

                        if (!activeElement) return;

                        activeElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                        });
                    }}
                    onListActiveChange={(item, { listingData }) => {
                        onListActiveChange?.(item, listingData);
                    }}
                    isListMoveToTop={isMoveTop}
                    isListScrollable={isScrollable}
                >
                    {renderListingSection ||
                        (({ isLoading, data, stats, activeId }) => {
                            if (!data?.length && isLoading)
                                return (
                                    renderCardLoading ?? (
                                        <PageLoader screenHeight={false} />
                                    )
                                );
                            if (!data?.length)
                                return <NoDataFound customIconSize={120} />;

                            return (
                                <div
                                    className={cn(
                                        'overflow-hidden flex-1 col-flex',
                                        listContainerClassName
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'overflow-y-auto flex-1 px-2 py-2 space-y-2 scrollbar-none',
                                            listWrapperClassName
                                        )}
                                        ref={
                                            isScrollable &&
                                            !isMoveTop &&
                                            scrollRef
                                        }
                                    >
                                        {data.map((item, index) => (
                                            <Slot
                                                key={item?.id}
                                                data-id={item?.id}
                                            >
                                                {renderCardItem?.(
                                                    item,
                                                    activeId,
                                                    index
                                                )}
                                            </Slot>
                                        ))}
                                    </div>
                                    {isShowPagination && (
                                        <ArcPagination
                                            containerClass='sticky bottom-0 w-full rounded-t-none border-0'
                                            pagination={{
                                                page: Number(pagination?.page),
                                                limit: Number(
                                                    pagination?.limit
                                                ),
                                            }}
                                            totalRecords={stats?.total}
                                            onPaginationChange={(
                                                pagination
                                            ) => {
                                                setPagination({
                                                    page: pagination.page,
                                                    limit: pagination.limit,
                                                });
                                            }}
                                            showEntries
                                            onlyShowPrevNext
                                        />
                                    )}
                                </div>
                            );
                        })}

                    {({ data, isLoading }) => {
                        if (!data && !isLoading) return <NoDataFound />;
                        return renderDetailSection?.({ data, isLoading });
                    }}
                </TwinPanel>
            </div>
        </div>
    );
};

export default withFilterProviderExport(ArcGenericSplitDetail);
