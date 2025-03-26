import { Button, IconButton, InputField } from '@finnoto/design-system';

import { Section } from '../node-component/set.list.question.modal';

import { DeleteSvgIcon } from 'assets';

export const FlowBuilderListAnswerOptions = ({
    setSections,
    sections = [],
}: {
    setSections: (__: any) => void;
    sections?: Section[];
}) => {
    const addSection = () => {
        setSections((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                title: '',
                rows: [
                    {
                        id: Date.now().toString(),
                        text: '',
                        description: '',
                    },
                ],
            },
        ]);
    };

    const removeSection = (sectionId: string) => {
        setSections((prev) =>
            prev.filter((section) => section.id !== sectionId)
        );
    };

    const updateSectionTitle = (sectionId: string, title: string) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === sectionId ? { ...section, title } : section
            )
        );
    };

    const addRow = (sectionId: string) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === sectionId && section.rows.length < 10 // Limit to 10 rows
                    ? {
                          ...section,
                          rows: [
                              ...section.rows,
                              {
                                  id: Date.now().toString(),
                                  text: '',
                                  description: '',
                              },
                          ],
                      }
                    : section
            )
        );
    };

    const updateRow = (
        sectionId: string,
        rowId: string,
        text: string,
        description: string
    ) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === sectionId
                    ? {
                          ...section,
                          rows: section.rows.map((row) =>
                              row.id === rowId
                                  ? { ...row, text, description }
                                  : row
                          ),
                      }
                    : section
            )
        );
    };

    const removeRow = (sectionId: string, rowId: string) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === sectionId
                    ? {
                          ...section,
                          rows: section.rows.filter((row) => row.id !== rowId),
                      }
                    : section
            )
        );
    };

    return (
        <div className='space-y-4'>
            {sections.map((section) => (
                <div key={section.id} className='p-4 bg-gray-100 rounded-lg'>
                    <div className='mb-4'>
                        <InputField
                            value={section.title}
                            onChange={(value) =>
                                updateSectionTitle(section.id, value)
                            }
                            placeholder='Section Title (optional, max 24 chars)'
                            maxLength={24}
                        />
                    </div>

                    {section.rows.map((row, rowIndex) => (
                        <div key={row.id} className='mb-2'>
                            <div className='flex gap-3 items-center'>
                                <div className='flex-1 gap-1 items-center px-3 py-1 bg-white rounded col-flex'>
                                    <InputField
                                        className='w-full'
                                        value={row.text}
                                        onChange={(value) =>
                                            updateRow(
                                                section.id,
                                                row.id,
                                                value,
                                                row.description
                                            )
                                        }
                                        placeholder={`Row ${
                                            rowIndex + 1
                                        } (required, max 24 chars)`}
                                        maxLength={24}
                                    />
                                    <InputField
                                        className='w-full'
                                        value={row.description}
                                        onChange={(value) =>
                                            updateRow(
                                                section.id,
                                                row.id,
                                                row.text,
                                                value
                                            )
                                        }
                                        placeholder='Description (optional)'
                                    />
                                </div>
                                <IconButton
                                    icon={DeleteSvgIcon}
                                    appearance='error'
                                    outline
                                    onClick={() =>
                                        removeRow(section.id, row.id)
                                    }
                                />
                            </div>
                        </div>
                    ))}

                    <div className='mt-2'>
                        <Button
                            appearance='link'
                            onClick={() => addRow(section.id)}
                            disabled={section.rows.length >= 10} // Disable if 10 rows already
                        >
                            New Row
                        </Button>
                    </div>

                    <Button
                        appearance='error'
                        outline
                        className='mt-4 w-full'
                        onClick={() => removeSection(section.id)}
                    >
                        Remove Section
                    </Button>
                </div>
            ))}

            <Button
                appearance='success'
                outline
                className='w-full'
                onClick={addSection}
            >
                Add New Section
            </Button>
        </div>
    );
};
