import { KeywordMatchingTypeEnum } from '@finnoto/core/src/backend/communication/dto/create.keyword.detail.dto';
import {
    Button,
    FormBuilder,
    IconButton,
    Modal,
    ModalContainer,
    RadioGroup,
    Range,
} from '@finnoto/design-system';

import { CrossSvgIcon } from 'assets';

const AddKeywordModule = ({
    keywords,
    setKeyword,
    removeKeywordAt,
    rageValue,
    setRageValue,
    fuzzyMatchingRage,
    setFuzzyMatchingRage,
}: any) => {
    return (
        <div className='gap-3 p-4 col-flex fap-3'>
            <div className='flex gap-3 items-center'>
                <h3 className='text-xl'>Keywords:</h3>
                <div className='flex gap-2 items-center'>
                    {keywords?.map((word, index) => {
                        return (
                            <div
                                key={word}
                                className='px-3 gap-2 text-lg py-1.5 flex item border border-dashed border-primary bg-base-200 rounded'
                            >
                                {word}

                                <IconButton
                                    outline
                                    icon={CrossSvgIcon}
                                    appearance='errorHover'
                                    size='xs'
                                    onClick={() => removeKeywordAt(index)}
                                />
                            </div>
                        );
                    })}
                    <Button
                        outline
                        dashed
                        onClick={() => {
                            openAddKeyword({
                                initialValues: keywords,
                                onAdd: (value: any) => {
                                    setKeyword(value);
                                },
                            });
                        }}
                    >
                        + Add Keyword
                    </Button>
                </div>
            </div>
            <div className='flex gap-3 items-center'>
                <span className='text-lg'>Message matching methods</span>
                <RadioGroup
                    direction='horizontal'
                    value={rageValue}
                    onChange={(val: any) => {
                        setRageValue(val);
                    }}
                    options={[
                        {
                            label: 'Exact',
                            value: KeywordMatchingTypeEnum.EXACT,
                        },
                        {
                            label: 'Contain',
                            value: KeywordMatchingTypeEnum.CONTAIN,
                        },
                        {
                            label: 'Fuzzy',
                            value: KeywordMatchingTypeEnum.FUZZY,
                        },
                    ]}
                />
                {rageValue === KeywordMatchingTypeEnum.FUZZY && (
                    <div className='flex gap-1 items-center w-2/4'>
                        <Range
                            appreance='secondary'
                            size='sm'
                            step={5}
                            value={fuzzyMatchingRage}
                            onChange={(val: any) => setFuzzyMatchingRage(val)}
                        />
                        <span className='text-lg'>{fuzzyMatchingRage}%</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddKeywordModule;

const openAddKeyword = ({ onAdd, initialValues }: any) => {
    Modal.open({
        component: AddKeywordModel,
        modalSize: 'xs',
        props: {
            onAdd,
            initialValues,
        },
    });
};

const AddKeywordModel = ({ onAdd, initialValues }) => {
    return (
        <ModalContainer title='Add Keyword'>
            <FormBuilder
                className='relative flex-1 p-3'
                withSaveAndNew
                modalBodyClassName='pb-2'
                formSchema={{
                    keyword: {
                        type: 'text',
                        placeholder: 'Enter the keyword here..',
                        label: 'Keyword',
                        required: true,
                    },
                }}
                onSubmit={async (values, { setError, isCreateAnother }) => {
                    if (initialValues?.includes(values?.keyword)) {
                        return setError({ keyword: 'Duplicate value' });
                    }

                    onAdd(values.keyword?.toLowerCase());

                    if (!isCreateAnother) Modal.close();
                }}
            />
        </ModalContainer>
    );
};
