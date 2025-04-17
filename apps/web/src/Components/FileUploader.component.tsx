import { useDropzone } from 'react-dropzone';

import { GetItem, UserBusiness } from '@finnoto/core';
import { Button } from '@finnoto/design-system';

const FileUploaderComponent = ({
    onFileUploadDone,
    accepts,
    value,
    error,
}: {
    onFileUploadDone?: (files: any) => void;
    accepts?: any;
    value?: any;
    error?: any;
}) => {
    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const formData = new FormData();
        const file = acceptedFiles[0]; // Only upload the first file
        formData.append('file', file);

        const url = UserBusiness.getBusinessAPIUrl();

        try {
            const response = await fetch(`${url}api/b/upload-files`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${GetItem('ACCESS_TOKEN', false)}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('File upload failed');
            }

            const data = await response.json();
            onFileUploadDone?.({
                link: data?.[0],
                name: file?.name,
                type: file?.type,
                size: file?.size,
            });
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accepts,
        multiple: false,
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button appearance={'primary'} outline>
                Upload Image
            </Button>
        </div>
    );
};

export default FileUploaderComponent;
