import { ReactNode } from 'react';

import { FileData, FileUploadSource, ObjectDto } from '@finnoto/core';

import { FileUploadInterface } from '../../Components/Inputs/FileUpload/fileUpload.types';

export interface CommonFileUploderInterface
    extends Omit<FileUploadInterface, 'onDropFile'> {
    source?: FileUploadSource;
    onFileUpload?: (data: FileData[]) => void;
    endpoint?: string;
    headers?: ObjectDto;
    classParams?: ObjectDto;
}

export interface MultipleFileUploadInterface
    extends CommonFileUploderInterface {
    defaultValueShow?: boolean;
    btnSize?: 'sm' | 'md';
    ellipse_length?: number;
    className?: string;
    titleClassName?: string;
    value?: FileData[];
    isHideFiles?: boolean;
    error?: string;
    hideDelete?: boolean;
    supportedFileText?: string;
    showButton?: boolean;
}

export interface SingleFileUploadInterface
    extends Omit<CommonFileUploderInterface, 'maxFiles' | 'is_multiple'> {
    defaultValueShow?: boolean;
    btnSize?: 'sm' | 'md';
    ellipse_length?: number;
    className?: string;
    titleClassName?: string;
    value?: FileData[];
    isHideFiles?: boolean;
    error?: string;
    hideDelete?: boolean;
    fileSupportText?: string;
    required?: boolean;
}

export interface SmallMultipleFileUploadInterface
    extends CommonFileUploderInterface {
    defaultValueShow?: boolean;
    ellipse_length?: number;
    className?: string;
    titleClassName?: string;
    value?: FileData[];
    isHideFiles?: boolean;
    error?: string;
    required?: boolean;
    hideDelete?: boolean;
    rightLabel?: ReactNode;
    classParams?: ObjectDto;
}
export interface ProfileUploaderInterface extends CommonFileUploderInterface {
    className?: string;
    value?: string;
    error?: string;
    onSingleFileUpload: (imgUrl: string) => void;
}

export interface UplodedFileProps {
    file: any;
    handleRemoveFile?: () => void;
    imageViwer: () => void;
    hideDelete?: boolean;
}
