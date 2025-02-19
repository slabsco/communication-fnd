import { File } from 'lucide-react';
import Image from 'next/image';

import { Ellipsis } from '@finnoto/core';
import {
    IconButton,
    Modal,
    ModalBody,
    ModalContainer,
    Swipper,
} from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../Components/GenericDocumentListing/genericDocumentListing.component';
import { addQuickReplyFormUtil } from './add.quick.reply.form.util';

import { AddSvgIcon, EditSvgIcon, TickMarkSvgIcon } from 'assets';

const QuickReplySelectList = ({ getData }: { getData?: (data) => void }) => {
    return (
        <ModalContainer
            title='Use a Quick Response'
            className='h-[90vh] w-[70vw]'
        >
            <ModalBody className='h-full'>
                <GenericDocumentListingComponent
                    renderRightFilterComponent={
                        <IconButton
                            name='Add Quick Reply'
                            icon={AddSvgIcon}
                            onClick={addQuickReplyFormUtil}
                        />
                    }
                    table={[]}
                    type='quickReply'
                    tableType='card'
                    name='Quick Response'
                    asInnerTable
                    renderMiddleComponent={(data) => {
                        return (
                            <div className='grid grid-cols-3 gap-2 py-3 h-[600px] overflow-hidden overflow-y-auto'>
                                {data?.map((val) => {
                                    return (
                                        <div
                                            key={val?.id}
                                            className='overflow-hidden relative gap-2 p-3 rounded border shadow h-fit col-flex bg-base-200'
                                        >
                                            <div className='flex gap-2 justify-between items-center'>
                                                <p className='font-semibold'>
                                                    {val?.name}
                                                </p>
                                                <div className='flex gap-2 items-center p-3 rounded bg-base-100'>
                                                    <IconButton
                                                        onClick={() => {
                                                            addQuickReplyFormUtil(
                                                                val
                                                            );
                                                        }}
                                                        appearance='info'
                                                        outline
                                                        icon={EditSvgIcon}
                                                        size='xs'
                                                    />
                                                </div>
                                            </div>

                                            <div className='p-2 text-sm rounded bg-base-100 h-[50px]'>
                                                {Ellipsis({
                                                    text: val?.message,
                                                    length: 100,
                                                })}
                                            </div>

                                            <div className='flex gap-2 items-center'>
                                                <Swipper
                                                    settings={{}}
                                                    className='overflow-hidden p-2 w-full overflow-y-auto h-[190px] rounded bg-base-100'
                                                >
                                                    {val?.document?.map(
                                                        (doc) => (
                                                            <RenderDocument
                                                                doc={doc}
                                                                key={doc.type}
                                                            />
                                                        )
                                                    )}
                                                </Swipper>
                                            </div>

                                            <div className='absolute bottom-1 right-3 z-50 p-2 rounded-full bg-base-100'>
                                                <IconButton
                                                    name='select'
                                                    icon={TickMarkSvgIcon}
                                                    outline
                                                    iconSize={14}
                                                    appearance='accent'
                                                    size='xs'
                                                    onClick={() => {
                                                        getData(val);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }}
                />
            </ModalBody>
        </ModalContainer>
    );
};

export default QuickReplySelectList;

const RenderDocument = ({ doc }: { doc: any }) => {
    if (doc?.attributes?.type.includes('image'))
        return (
            <Image
                height={100}
                className='object-contain w-full h-full'
                width={100}
                alt='image'
                src={doc?.document_url}
            />
        );
    if (doc?.attributes?.type.includes('application'))
        return <iframe src={doc?.document_url} width='100%' height='100%' />;

    if (doc?.attributes?.type.includes('text'))
        return (
            <div className='flex gap-2 h-[150px] justify-center items-center'>
                <File size={20} />
                {doc?.attributes?.name}
            </div>
        );
};
export const openQuickReplySelect = ({
    getData,
}: {
    getData?: (data: any) => void;
}) => {
    return Modal.open({
        component: QuickReplySelectList,
        props: {
            getData: (data: any) => {
                Modal.close();
                getData?.(data);
            },
        },
        modalSize: 'auto',
    });
};
