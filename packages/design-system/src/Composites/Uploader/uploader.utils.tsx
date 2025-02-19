import { GetFileDetails } from '@finnoto/core';

import { ImageViewer } from '../../Components';
import { ResourceCarouselModalViewer } from '../../Components/Data-display/ResourceViewer/resourceCarouselModalViewer.component';
import { Modal } from '../../Utils';

import {
    FileCSVSvgIcon,
    FileJPGSvgIcon,
    FileJSONSvgIcon,
    FilePdfSvgIcon,
    FilePNGSvgIcon,
    FilePPTSvgIcon,
    FileSvgSvgIcon,
    FileXSLSvgIcon,
} from 'assets';

export const handleDocumentIcon = (value: string) => {
    const extension = GetFileDetails(value).extension;

    switch (extension) {
        case 'pdf':
            return FilePdfSvgIcon;
        case 'svg':
            return FileSvgSvgIcon;
        case 'png':
            return FilePNGSvgIcon;
        case 'jpg':
        case 'jpeg':
            return FileJPGSvgIcon;
        case 'xsl':
        case 'xlsx':
            return FileXSLSvgIcon;
        case 'csv':
            return FileCSVSvgIcon;
        case 'pptx':
            return FilePPTSvgIcon;
        case 'json':
            return FileJSONSvgIcon;
        default:
            return FilePdfSvgIcon;
    }
};
export const GetDocumentIconByExtension = (extension: string) => {
    switch (extension) {
        case 'pdf':
            return FilePdfSvgIcon;
        case 'svg':
            return FileSvgSvgIcon;
        case 'png':
            return FilePNGSvgIcon;
        case 'jpg':
        case 'jpeg':
            return FileJPGSvgIcon;
        case 'xsl':
        case 'xlsx':
            return FileXSLSvgIcon;
        case 'csv':
            return FileCSVSvgIcon;
        case 'pptx':
            return FilePPTSvgIcon;
        case 'json':
            return FileJSONSvgIcon;
        default:
            return FilePdfSvgIcon;
    }
};

// first params is list of files and second param is current open file
export const openResourceViewerModal = (files: any[], current_file: any) => {
    const showFiles = [current_file];
    files.forEach((file) => {
        if (
            !showFiles.find(
                (showFile) => showFile.document_url === file?.document_url
            ) &&
            file.document_url
        ) {
            showFiles.push(file);
        }
    });

    Modal.open({
        component: ImageViewer,
        modalSize: 'full',
        className: 'bg-black/60',
        closeClassName: 'text-white',
        props: {
            images: showFiles,
            zoomIn: true,
        },
    });
};

export function parseToServerFileFormat(file: any) {
    const { size, serverUrl: document_url, type, name } = file || {};

    file.document_url = document_url;
    file.attributes = { size, type, name };

    return file;
}
