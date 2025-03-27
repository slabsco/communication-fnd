import { Handle, Position } from 'reactflow';

import { CommonNodeComponentContainer } from '../components/flowbuilder.common';
import { FlowBuilderCommonTargetHandler } from '../components/flowbuilder.common.target.handler';
import { openListQuestionModal } from '../components/set.list.question.modal';
import { useFlowBuilder } from '../flowbuilder.context';

export const AskQuestionListNodeType = ({ data, id, type }: any) => {
    const { updateNodeData, isValidCondition } = useFlowBuilder();

    return (
        <CommonNodeComponentContainer
            data={data}
            id={id}
            type={type}
            actions={[
                {
                    name: 'Manage',
                    action: () => {
                        openListQuestionModal({
                            data: data,
                            getData: (data) => {
                                updateNodeData(id, data);
                            },
                        });
                    },
                },
            ]}
        >
            <div className='p-2 text-primary min-h-12 min-w-[300px]'>
                <div className='gap-2 col-flex'>
                    <RenderHeaderBodyFooter
                        body={data?.html}
                        footer={data?.footer}
                        header={data?.header}
                    />

                    <div className='gap-2 col-flex'>
                        {data?.sections?.map((_section) => {
                            return (
                                <div
                                    key={_section?.id}
                                    className='p-1 rounded bg-base-300'
                                >
                                    {_section?.title}

                                    <div className='gap-1 p-1 rounded col-flex bg-base-100'>
                                        {_section?.rows?.map((_row) => {
                                            return (
                                                <div
                                                    key={_row?.id}
                                                    className='relative p-1 leading-3 rounded col-flex bg-primary text-primary-content'
                                                >
                                                    <p className='text-[10px]'>
                                                        {_row.text}
                                                    </p>
                                                    <p className='text-base-tertiary text-[8px]'>
                                                        {_row.description}
                                                    </p>
                                                    <Handle
                                                        type='source'
                                                        position={
                                                            Position.Right
                                                        }
                                                        id={_row.id}
                                                        isValidConnection={(
                                                            connection
                                                        ) => {
                                                            return isValidCondition(
                                                                connection.sourceHandle,
                                                                'sourceHandle'
                                                            );
                                                        }}
                                                        className='w-3 h-3 bg-blue-400 border-2 border-white'
                                                        style={{
                                                            right: 1,
                                                            top: '50%',
                                                            transform:
                                                                'translateY(-50%)',
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <FlowBuilderCommonTargetHandler />
        </CommonNodeComponentContainer>
    );
};

export const RenderHeaderBodyFooter = ({
    header = '',
    body = '',
    footer = '',
}: {
    header: string;
    body: string;
    footer: string;
}) => {
    return (
        <div className='gap-2 fol-flex'>
            <div className='text-base font-semibold'>{header}</div>
            {body && (
                <div
                    dangerouslySetInnerHTML={{ __html: body }}
                    className='text-sm'
                ></div>
            )}
            <div className='text-xs text-base-tertiary'>{footer}</div>
        </div>
    );
};
