'use client';

import { useCallback, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { cn } from '../../../../Utils/common.ui.utils';
import { CustomPasswordInput } from './customePdfPasswordFeild.component';
import { PasswordResponses } from './passwordResponses.enum';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
/**
 * Renders a PDF viewer component with the given PDF file URL and zoom scale.
 *
 * @param {any} fileUrl - URL of the PDF file to be rendered
 * @param {number} [zoomScale=0] - zoom scale of the PDF viewer
 * @return {JSX.Element} the PDF viewer component
 */

export const PdfViewer = ({
    fileUrl,
    zoomScale = 0,
    documentClassName = '',
}: any) => {
    const docRef = useRef(null);

    const [numPages, setNumPages] = useState(0);
    const [password, setPassword] = useState('');
    const [showpasswordPrompt, setshowPasswordPrompt] = useState(false);
    const [errorPassword, setErrorPassWord] = useState(false);

    const handlePasswordEntered = (password) => {
        setPassword(password);
    };
    /**
     * Returns the bounding rectangle of the container element.
     *
     * @return {DOMRect|null} The bounding rectangle of the container element or null if it doesn't exist.
     */
    const getContainerRect = () => {
        if (!docRef.current) return null;
        return docRef.current.getBoundingClientRect();
    };

    const onPassword = useCallback(
        (callback, reason) => {
            switch (reason) {
                case PasswordResponses.NEED_PASSWORD: {
                    if (password) {
                        setshowPasswordPrompt(false);
                        return callback(password);
                    }
                    setshowPasswordPrompt(true);

                    break;
                }
                case PasswordResponses.INCORRECT_PASSWORD: {
                    setErrorPassWord(true);
                    setshowPasswordPrompt(true);

                    callback(password);

                    break;
                }
                default:
                    break;
            }
        },
        [password]
    );

    return (
        <div
            className='overflow-hidden relative h-full pdf-viewer'
            ref={docRef}
        >
            <div className='overflow-auto h-full'>
                <Document
                    key={`${fileUrl}${password}`}
                    file={fileUrl}
                    loading={` `}
                    onLoadSuccess={({ numPages: nextNumPages }) => {
                        setNumPages(nextNumPages);
                    }}
                    className={cn('gap-4 col-flex', `${documentClassName}`)}
                    onPassword={onPassword}
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={getContainerRect()?.width - 15 || 0}
                            renderAnnotationLayer={false}
                            scale={zoomScale}
                        />
                    ))}
                </Document>

                {showpasswordPrompt && (
                    <div className='flex absolute inset-0 z-10 justify-center items-center'>
                        <CustomPasswordInput
                            onPasswordEntered={handlePasswordEntered}
                            error={errorPassword}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export const RenderPdfDocument = ({
    url,
    className,
}: {
    url: string;
    className: string;
}) => {
    return (
        <div
            className={cn(
                'flex overflow-hidden justify-center items-center h-[300px] w-[300px]',
                className
            )}
        >
            <iframe src={url} width='100%' height='100%' />
        </div>
    );
};
