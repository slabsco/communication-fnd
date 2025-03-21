import { useState } from 'react';

import { Button, IconButton, InputField } from '@finnoto/design-system';

import { DeleteSvgIcon } from 'assets';

export interface AnswerOption {
    id: string;
    text: string;
}
export const FlowBuilderAnswerOptions = ({
    getAnswers,
    answers = [],
}: {
    getAnswers: (ans: AnswerOption[]) => void; // Updated to reflect the correct type
    answers: AnswerOption[];
}) => {
    const [options, setOptions] = useState<AnswerOption[]>(answers);
    const [newOption, setNewOption] = useState('');

    const handleAddOption = () => {
        if (newOption.trim()) {
            const newAnswerOption = {
                id: Date.now().toString(),
                text: newOption.trim(),
            };
            setOptions((prevOptions) => {
                const updatedOptions = [...prevOptions, newAnswerOption];
                getAnswers?.(updatedOptions); // Call getAnswers with the updated options
                return updatedOptions;
            });
            setNewOption('');
        }
    };

    const handleDeleteOption = (id: string) => {
        setOptions((prevOptions) => {
            const updatedOptions = prevOptions.filter(
                (option) => option.id !== id
            );
            getAnswers?.(updatedOptions); // Call getAnswers with the updated options
            return updatedOptions;
        });
    };

    return (
        <div>
            <FlowBuilderQuestionModalHeader name='Answer Options' />
            <div className='my-2 space-y-1'>
                {options.map((option) => (
                    <div
                        key={option.id}
                        className='flex justify-between items-center px-2 py-1 bg-gray-200 rounded-lg'
                    >
                        <span>{option.text}</span>
                        <IconButton
                            onClick={() => handleDeleteOption(option.id)}
                            icon={DeleteSvgIcon}
                            size='sm'
                            appearance='errorHover'
                        />
                    </div>
                ))}
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddOption();
                }}
                className='flex gap-2'
            >
                <InputField
                    type='text'
                    value={newOption}
                    onChange={(e) => setNewOption(e)}
                    placeholder='Add answer variant'
                    className='flex-1'
                />
                <Button size='lg' type='submit' outline>
                    Create
                </Button>
            </form>
        </div>
    );
};

export const FlowBuilderQuestionModalHeader = ({ name }) => {
    return <h2 className='text-base font-semibold'>{name}</h2>;
};
