import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useWindowSize } from 'react-use';

import {
    AccessManager,
    AccessValueOnNestedObjectByKey,
    GetFileDetails,
    getFileSizeInKB,
    IsFunction,
    ObjectDto,
    useUserHook,
} from '@finnoto/core';

import { handleDocumentIcon } from '../../../Composites';
import { ConfirmUtil } from '../../../Utils';
import { cn, Debounce } from '../../../Utils/common.ui.utils';
import { FormatDisplayDateStyled } from '../../../Utils/component.utils';
import { Swipper } from '../../Navigation/Swipper/swipper.component';
import { SwipperPropsSetting } from '../../Navigation/Swipper/swipper.types';
import { Ellipsis } from '../Ellipsis/ellipsis.component';
import { Icon } from '../Icon/icon.component';

import {
    ArrowRightSvgIcon,
    DeleteSvgIcon,
    FileDownloadSvgIcon,
    ZoomInChartSvgIcon,
    ZoomOutChartSvgIcon,
} from 'assets';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export const ImageViewer = ({
    images,
    initialImage = 0,
    title,
    onClickToDelete,
    addedBy,
    addedAt,
    popUpOff,
    imageClassName,
    zoomIn,
    pdfClassName,
}: {
    images: any;
    initialImage?: number;
    title?: string;
    onClickToDelete?: (__?: any) => void;
    addedAt?: string;
    addedBy?: string;
    popUpOff?: boolean;
    imageClassName?: string;
    zoomIn?: boolean;
    pdfClassName?: string;
}) => {
    const ref = useRef(null);
    const { user } = useUserHook();

    const hasMultipleImages = images?.length > 1;
    const [activeImageDetail, setActiveImageDetail] = useState(
        images[initialImage]
    );

    const totalImages = images?.length - 1;
    const [currentSliderIndex, setCurrentSliderIndex] =
        useState<number>(initialImage);

    const swipperSettings: SwipperPropsSetting = {
        arrows: false,
        dots: false,
        infinite: false,
        autoplay: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: initialImage,
        lazyLoad: 'ondemand',
        afterChange: (index) => {
            setCurrentSliderIndex(index);
            setActiveImageDetail(images[index]);
        },
    };

    const handleConfirmDeleteDocument = () => {
        if (popUpOff) return onClickToDelete(activeImageDetail);
        ConfirmUtil({
            title: 'Do you want to delete?',
            message: 'The action you are about to perform is irreversible.',
            confirmText: 'Yes',
            confirmAppearance: 'error',
            onConfirmPress: () => {
                onClickToDelete(activeImageDetail);
            },
        });
    };

    const handleNext = () => {
        ref?.current?.slickNext();
    };
    const handlePrev = () => {
        ref?.current?.slickPrev();
    };

    const isDeleteOptionShow = useMemo(() => {
        if (!IsFunction(onClickToDelete)) return false;
        if (AccessManager.hasRoleIdentifier('ua_document_manager')) return true;

        if (activeImageDetail?.attributes?.no_edit) return false;
        if (!activeImageDetail?.created_by) return true;
        return [user?.business?.owner_id, user?.id].includes(
            activeImageDetail?.created_by
        );
    }, [
        activeImageDetail?.attributes?.no_edit,
        activeImageDetail?.created_by,
        onClickToDelete,
        user?.business?.owner_id,
        user?.id,
    ]);
    const [zoomLevel, setZoomLevel] = useState(1);

    const handleZoomIn = () => {
        setZoomLevel((prevZoom) => prevZoom + 0.25);
    };

    const handleZoomOut = () => {
        setZoomLevel((prevZoom) => prevZoom - 0.25);
    };
    const onScroll = Debounce((e) => {
        if (!zoomIn) return; // Disallow zoom in if zoomIn prop is false
        if (zoomLevel < 1 && e.deltaY > 0) return; // Disallow zoom out below 1
        if (zoomLevel > 2.25 && e.deltaY < 0) return; // Disallow zoom in above 2.25

        const delta = e.deltaY * -0.01;
        const newScale = zoomLevel + delta;

        setZoomLevel(newScale);
    }, 200);

    const fileDetails = GetFileDetails(activeImageDetail.document_url || '');

    return (
        <div className='justify-between p-4 h-full col-flex text-primary-content'>
            <div className='w-10/12 text-sm min-h-[50px] '>
                <Ellipsis lines={3} withShowMore>
                    {AccessValueOnNestedObjectByKey(
                        activeImageDetail,
                        'comments'
                    )}
                </Ellipsis>
            </div>
            <Swipper
                ref={ref}
                settings={swipperSettings}
                className='overflow-hidden w-full'
            >
                {images?.map((img) => {
                    return (
                        <div key={img.id} className='document-slide h-'>
                            <ImageViewerContent
                                data={img}
                                imageClassName={imageClassName}
                                zoomIn={zoomIn}
                                pdfClassName={pdfClassName}
                                zoomLevel={zoomLevel}
                                onScroll={onScroll}
                            />
                        </div>
                    );
                })}
            </Swipper>
            <div className='justify-center items-center col-flex'>
                <div className='flex gap-3 justify-center items-center py-2'>
                    {hasMultipleImages && (
                        <div
                            onClick={handlePrev}
                            className={cn(
                                'w-10 h-10 rounded centralize cursor-pointer',
                                {
                                    'text-base-secondary':
                                        currentSliderIndex === 0,
                                }
                            )}
                        >
                            <Icon
                                source={ArrowRightSvgIcon}
                                isSvg
                                size={24}
                                className='rotate-180'
                            />
                        </div>
                    )}
                    {fileDetails.mimeType?.includes('pdf') && zoomIn && (
                        <Icon
                            source={ZoomInChartSvgIcon}
                            size={24}
                            isSvg
                            className={cn(
                                'w-10 h-10 centralize',
                                {
                                    'text-base-secondary pointer-events-none cursor-not-allowed':
                                        zoomLevel > 2.25,
                                },
                                {
                                    'cursor-pointer': zoomLevel <= 2.25,
                                }
                            )}
                            onClick={handleZoomIn}
                        />
                    )}

                    <Link
                        className='w-10 h-10 centralize'
                        download
                        href={activeImageDetail?.document_url}
                    >
                        <Icon source={FileDownloadSvgIcon} isSvg size={24} />
                    </Link>
                    {fileDetails.mimeType?.includes('pdf') && zoomIn && (
                        <Icon
                            source={ZoomOutChartSvgIcon}
                            isSvg
                            onClick={handleZoomOut}
                            size={24}
                            className={cn(
                                'w-10 h-10 centralize',
                                {
                                    'text-base-secondary  cursor-not-allowed pointer-events-none':
                                        zoomLevel <= 1,
                                },
                                {
                                    'cursor-pointer': zoomLevel > 1,
                                }
                            )}
                        />
                    )}
                    {isDeleteOptionShow && (
                        <div
                            onClick={handleConfirmDeleteDocument}
                            className='w-10 h-10 centralize'
                        >
                            <Icon
                                source={DeleteSvgIcon}
                                className='text-error'
                                isSvg
                                size={24}
                            />
                        </div>
                    )}
                    {hasMultipleImages && (
                        <div
                            onClick={handleNext}
                            className={cn(
                                'w-10 h-10 rounded centralize cursor-pointer',
                                {
                                    'text-base-secondary':
                                        currentSliderIndex === totalImages,
                                }
                            )}
                        >
                            <Icon source={ArrowRightSvgIcon} isSvg size={24} />
                        </div>
                    )}
                </div>
                <div className='gap-1 text-sm text-center col-flex'>
                    <Ellipsis width={200}>
                        {activeImageDetail?.attributes?.name}
                    </Ellipsis>

                    <div className='flex gap-2 justify-center items-center text-xs'>
                        {addedBy && (
                            <div className='flex items-center text-xs gap-1.5'>
                                <span>{addedBy}</span>
                                <span className='w-1 h-1 bg-white rounded-full'></span>
                            </div>
                        )}
                        {getFileSizeInKB(activeImageDetail?.attributes?.size)}
                        {addedAt && (
                            <div className='flex items-center gap-1.5'>
                                <span className='w-1 h-1 bg-white rounded-full'></span>
                                <span>
                                    {FormatDisplayDateStyled({
                                        value: addedAt,
                                        size: 'xs',
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ImageViewerContent = ({
    data = {},
    imageClassName,
    pdfClassName,
    zoomLevel = 1,
    onScroll,
}: {
    data: ObjectDto;
    imageClassName: string;
    pdfClassName?: string;
    zoomIn?: boolean;
    zoomLevel?: number;
    onScroll?: (e) => void;
}) => {
    const fileDetails = GetFileDetails(data.document_url || '');
    const [numPages, setNumPages] = useState(0);
    const { height } = useWindowSize();

    if (fileDetails.mimeType?.includes('pdf')) {
        return (
            <div
                className='overflow-y-auto justify-start max-h-full col-flex'
                style={{ height: height - 150 }}
            >
                <Document
                    file={data.document_url}
                    renderMode='svg'
                    className={cn('gap-4 items-center col-flex', pdfClassName)}
                    onLoadSuccess={({ numPages: nextNumPages }) => {
                        setNumPages(nextNumPages);
                    }}
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <div onWheelCapture={onScroll}>
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                height={height - 150}
                                renderAnnotationLayer={false}
                                scale={zoomLevel}
                            />
                        </div>
                    ))}
                </Document>
            </div>
        );
    }

    if (fileDetails.mimeType?.startsWith('image')) {
        return (
            <div
                className='overflow-hidden justify-center items-center rounded col-flex'
                style={{
                    height: height - 150,
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    alt='image'
                    src={data.document_url}
                    className={cn(
                        'object-contain w-full h-full',
                        imageClassName
                    )}
                />
            </div>
        );
    }

    return (
        <div className='items-center col-flex'>
            <Icon
                source={handleDocumentIcon(data.document_url)}
                isSvg
                size={64}
                className='p-6 h-full rounded-lg bg-base-100'
            />
        </div>
    );
};
