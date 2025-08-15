import { useMemo } from 'react';

import {
    AccessManager,
    FormBuilderFormSchema,
    FormBuilderSubmitType,
    ObjectDto,
    PRODUCT_IDENTIFIER,
    useApp,
    useCustomQueryDetail,
    useFetchParams,
    useFormBuilder,
} from '@finnoto/core';
import {
    Button,
    FilterListDisplay,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
} from '@finnoto/design-system';

export const SaveFilterForm = ({
    filterData,
    listFilters,
    onSubmit,
    data,
    filter_query: filterQueryProps,
    definitionKey,
}: {
    filterData: any;
    listFilters: any;
    onSubmit: FormBuilderSubmitType;
    data?: ObjectDto;
    filter_query?: string;
    definitionKey?: string;
}) => {
    const { filter_query = filterQueryProps } = useFetchParams();
    const { product_id } = useApp();
    const isEdit = !!data?.id;
    const { data: preference } = useCustomQueryDetail({
        type: 'listing_preference',
        methodParams: {
            slug: definitionKey,
            id: data?.id,
        },

        disableNetwork: !data?.id || !definitionKey,
    });

    const globalSchema: FormBuilderFormSchema = useMemo(() => {
        if (!AccessManager.hasRoleIdentifier('ua_listing_overrider')) return {};
        return {
            is_global: {
                type: 'boolean',
                label: 'Make it global',
            },
        };
    }, []);

    const userSchema = useMemo(() => {
        if (PRODUCT_IDENTIFIER.VENDOR === product_id) return {};
        return {
            user_ids: {
                type: 'reference_multi_select',
                label: 'Users',
                placeholder: 'Users',
                controller_type: 'business_users',
                isMulti: true,
                menuPosition: 'fixed',
                subLabelKey: 'email',
                valueKey: 'user_id',
                queryIds: 'user_ids',
            },
        };
    }, [product_id]);
    const initValues = useMemo(() => {
        return {
            ...data,
            user_ids: preference?.preference_users?.map(
                (user) => user?.user_id
            ),
            group_ids: preference?.preference_user_groups?.map(
                (group) => group?.user_group_id
            ),
        };
    }, [
        data,
        preference?.preference_user_groups,
        preference?.preference_users,
    ]);
    const {
        renderFormFields,
        handleSubmit,
        disableSubmit,
        isSubmitting,
        getValues: getFormValues,
    } = useFormBuilder({
        formSchema: {
            identifier: {
                type: 'text',
                label: 'Name',
                placeholder: 'Name',
                required: true,
            },
            ...userSchema,
            ...globalSchema,
        },
        onSubmit,
        initValues,
    });

    return (
        <ModalContainer title={isEdit ? 'Edit Save Filter' : 'Save Filter'}>
            <form onSubmit={handleSubmit} noValidate>
                <ModalBody className='gap-4 rounded col-flex'>
                    {renderFormFields('identifier')}
                    <div className='gap-2 col-flex'>
                        <div className='w-fit'>
                            {renderFormFields('is_global')}
                        </div>
                        {!getFormValues('is_global') &&
                            renderFormFields('user_ids')}
                        <div className='px-2 mt-2 text-xs font-medium text-base-primary'>
                            Filter Query
                        </div>
                        <FilterListDisplay
                            {...{
                                data: filterData,
                                listFilters: listFilters?.map((item) => ({
                                    ...item,
                                    isClearable: false,
                                    isDeletable: false,
                                })),
                                filterQuery: filter_query,
                                className:
                                    'py-3 pr-3 border rounded-sm bg-base-100 border-base-300 ',
                                isDeletableQuery: false,
                            }}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className='gap-4 justify-end items-center w-full row-flex'>
                        <Button
                            appearance='errorHover'
                            onClick={() => Modal.close()}
                            type='reset'
                        >
                            Cancel
                        </Button>
                        <Button
                            appearance='success'
                            loading={isSubmitting}
                            onClick={handleSubmit}
                            disabled={disableSubmit}
                            defaultMinWidth
                        >
                            Save
                        </Button>
                    </div>
                </ModalFooter>
            </form>
        </ModalContainer>
    );
};
