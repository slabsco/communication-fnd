import Link from 'next/link';

import { BasicFilterButton, cn } from '@finnoto/design-system';

import {
    TemplateCategoryConstant,
    TemplateCategorySupport,
} from '../constants/template.format';
import { useTemplate } from '../template.context';

const SetupTemplate = () => {
    const { state, dispatch } = useTemplate();
    const { category, type } = state;

    const TemplateCategoryTypes = [
        {
            name: 'Default',
            description:
                'Send messages with media and customized buttons to engage your customers.',
            key: 'DEFAULT',
            supportedCategory: [
                TemplateCategoryConstant.marketing,
                TemplateCategoryConstant.utility,
            ],
        },
        {
            name: 'Calling Permission Request',
            description: 'Ask customers if you can call them on WhatsApp.',
            key: 'CALLING_PERMISSION_REQUEST',
            supportedCategory: [
                TemplateCategoryConstant.utility,
                TemplateCategoryConstant.marketing,
            ],
        },
        {
            name: 'One Time Password',
            description: 'Send a one time password to your customers.',
            key: 'ONE_TIME_PASSWORD',
            supportedCategory: [TemplateCategoryConstant.authentication],
        },
    ];

    return (
        <div className='gap-3 p-3 w-full col-flex bg-base-100'>
            <p className='text-xl font-medium'>Set up your template</p>
            <div className='gap-2 col-flex'>
                <p className='text-base-secondary'>
                    Choose the category that best describes your message
                    template. Then select the type of message you want to send.{' '}
                    <Link href={'#'} className='link link-hover'>
                        Learn more about categories.
                    </Link>
                </p>
                <BasicFilterButton
                    disableNav
                    size='normal'
                    containerClass='w-full'
                    itemClassName='flex-1'
                    active={category}
                    onFilterChange={(val) => {
                        const type = TemplateCategoryTypes.find((_val) =>
                            _val.supportedCategory.includes(
                                val as TemplateCategorySupport
                            )
                        );

                        dispatch({
                            type: 'UPDATE_CATEGORY',
                            payload: {
                                category: val,
                                type: type.key,
                                complete: false,
                            },
                        });
                    }}
                    filters={[
                        {
                            label: 'Marketing',
                            key: TemplateCategoryConstant.marketing,
                        },
                        {
                            label: 'Utility',
                            key: TemplateCategoryConstant.utility,
                        },
                        {
                            label: 'Authentication',
                            key: TemplateCategoryConstant.authentication,
                        },
                    ]}
                />
            </div>

            {TemplateCategoryTypes?.map((_val) => {
                const active = _val.supportedCategory.includes(category);
                if (!active) return null;

                return (
                    <CategoryTypeSelector
                        active={type === _val.key}
                        key={_val.name}
                        description={_val.description}
                        header={_val.name}
                        onClick={() => {
                            dispatch({
                                type: 'UPDATE_TYPE',
                                payload: _val.key,
                            });
                        }}
                    />
                );
            })}
        </div>
    );
};

export default SetupTemplate;

const CategoryTypeSelector = ({
    active,
    header,
    description,
    onClick,
}: {
    active?: boolean;
    header: string;
    description: string;
    onClick?: () => void;
}) => {
    return (
        <div
            className={cn(
                'flex gap-2 items-center px-2 py-3 rounded cursor-pointer hover:bg-base-200',
                {
                    'bg-base-200': active,
                }
            )}
            onClick={onClick}
        >
            <span className='w-5 h-5 rounded-full border centralize'>
                <span
                    className={cn('flex w-3 h-3 rounded-full', {
                        'bg-primary': active,
                    })}
                ></span>
            </span>
            <div className='col-flex'>
                <p className='font-medium'>{header}</p>
                <p className='text-xs text-base-secondary'>{description}</p>
            </div>
        </div>
    );
};
