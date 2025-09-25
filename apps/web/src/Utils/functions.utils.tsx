import { format } from 'date-fns';
import dynamic from 'next/dynamic';

import {
    ApprovalStatusTypeEnum,
    Authentication,
    CANCEL_API_REQUEST,
    CHARGEBACK_DETAIL_PAGE_ROUTE,
    CommentCreationPayload,
    DocumentUploadResponsePayload,
    EMPLOYEE_EMAIL_MESSAGES_LIST_ROUTE,
    EMPLOYEE_EXPENSE_DASHBOARD_ROUTE,
    EMPLOYEE_REPORT_ROUTE,
    EmptyFunction,
    fetchBusinesses,
    FetchData,
    FINOPS_DEPARTMENT_DETAIL_ROUTE,
    FINOPS_DESIGNATION_DETAIL_ROUTE,
    FINOPS_EMAIL_MESSAGES_LIST_ROUTE,
    FINOPS_EMPLOYEE_DETAIL,
    FINOPS_EXPENSE_DETAILS_ROUTE,
    FINOPS_EXPENSE_HEAD_DETAIL_ROUTE,
    FINOPS_GSTR2_ITEM_DETAIL_ROUTE,
    FINOPS_RECURRING_ADVANCE_ROUTE,
    FINOPS_RECURRING_EXPENSE_ROUTE,
    FINOPS_VENDOR_DETAIL_ROUTE,
    FormBuilderFormSchema,
    GenericListingType,
    LISTING_CONTROLLER_ROUTER,
    LOGIN_ROUTE,
    Navigation,
    ObjectDto,
    ProcessUploadData,
    PRODUCT_IDENTIFIER,
    RefetchGenericListing,
    StoreEvent,
    toastBackendError,
    UserBusiness,
} from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import { Menu } from '@finnoto/core/src/Utils/menu.utils';
import {
    ApiSchema,
    Badge,
    Icon,
    ImageCropper,
    ImageViewer,
    LargeFilesUploader,
    Modal,
    ModalFormUtil,
    NoDataFound,
    openFullViewImage,
    PageLoader,
    Progress,
    SlidingPane,
    Toast,
} from '@finnoto/design-system';
import { LargeFileUploadInterface } from '@finnoto/design-system/src/Composites/Uploader/LargeFileUploader/large.files.types';

import AggregateDetails from '@Components/AggregateDetails/aggregateDetails.component';
import CommonKeyValueList, {
    CommonKeyValueQueryFnType,
} from '@Components/CommonDocumentList/commonKeyValue.list.component';
import CommonKeyValueListTable, {
    CommonKeyValueTableQueryFnType,
} from '@Components/CommonDocumentList/commonKeyValue.list.table.component';
import AddContactPersonForm from '@Components/CommonFormComponents/addContactPerson.form.component';
import AddDocumentsFormLocal from '@Components/CommonFormComponents/addDocumentsLocal.form.component';
import AddNotesForm from '@Components/CommonFormComponents/addNotes.form.component';
import GenericDashboardReportModal, {
    DashboardReportModalProps,
} from '@Components/DashboardReportModal/GenericDashboardReportModal.component';
import SavedFilters from '@Components/GenericDocumentListing/Components/SavedFilters/savedFilters.component';
import PriorityChanger, {
    PriorityChangerProps,
} from '@Components/PriorityChanger/priorityChanger.component';
import ShortCutPanel from '@Components/ShortCutPanel/shortCutPanel.component';
import BusinessInvitation from '@Modules/AuthPage/Components/businessInvitation.component';
import BusinessOnboarding from '@Modules/AuthPage/Components/businessOnboarding.component';
import BusinessSelector from '@Modules/AuthPage/Components/businessSelector.component';
import NewProductSelector from '@Modules/AuthPage/Components/newProductSelector.component';
import OwnershipTransferInvitations from '@Modules/AuthPage/Components/ownershipTransferInvitation.component';
import ChangeOrgNameForm from '@Modules/user_profile/Forms/changeOrgName.form';

import BackendErrorModal from '../Components/backend.error.modal';
import BulkUploadModal from '../Components/bulkUploadModal.component';
import UserDetailsModal from '../Components/userDetailsModal';

import { PercentageSquareSvgIcon } from 'assets';

export const toastLoading = Toast.loading;

/**
 * Logs out the user by calling the Authentication.logout() function and navigates to
 * the login page by calling the Navigation.navigate() function with the LOGIN_ROUTE URL.
 *
 * @returns {void} There is no return value from this function.
 */
export const logout = async () => {
    await Authentication.logout();
    Navigation.navigate({ url: LOGIN_ROUTE });
};

/**
 * Opens the onboarding modal and allows the user to enter business information.
 *
 * @param {function} callback - optional callback function to execute after submitting the form
 * @param {ObjectDto} data - optional pre-filled data to display in the form
 */
export const openOnboarding = (
    callback: (business: ObjectDto) => void = () => {},
    data?: ObjectDto
) => {
    Modal.open({
        modalSize: 'auto',
        component: BusinessOnboarding,
        closable: false,
        containerStyle: {
            borderRadius: 4,
        },
        props: {
            data,
            callback: (business: ObjectDto) => {
                Modal.close();
                callback(business);
            },
        },
    });
};

/**
 * Opens a business selector modal to choose a business from a list of businesses and calls the provided callback
 * with the selected business.
 *
 * @param {ObjectDto[]} businesses - An array of ObjectDto representing the list of businesses to choose from.
 * @param {(business: ObjectDto) => Promise<void>} [callback=async () => {}] - A callback function that takes a
 * selected business as input and returns a Promise that resolves when the modal is closed.
 */
export const openBusinessSelector = (
    businesses: ObjectDto[],
    callback: (business: ObjectDto) => Promise<void> = async () => {}
) => {
    Modal.open({
        component: BusinessSelector,
        closable: false,
        modalSize: 'auto',
        props: {
            businesses,
            callback: async (business: ObjectDto) => {
                await callback(business);
                Modal.close();
            },
        },
    });
};

/**
 * Opens a product selector modal window.
 *
 * @param {ObjectDto[]} products - An array of product objects.
 * @param {(product: ObjectDto) => Promise<void>} [callback=async () => {}] - A callback function that is called after a product is selected.
 * @return {void}
 */
export const openProductSelector = (
    products: ObjectDto[],
    callback: (product: ObjectDto) => Promise<void> = async () => {}
) => {
    Modal.open({
        component: NewProductSelector,
        modalSize: 'sm',

        props: {
            products,
            callback: async (product: ObjectDto) => {
                await callback(product);
                Modal.close();
            },
        },
    });
};

/**
 * Opens the Business Invitation Modal.
 *
 * @param {ObjectDto[]} invitations - An array of business invitations.
 * @param {(business: ObjectDto) => Promise<void>} [callback=async () => {}] - A callback function that gets called when a business is selected.
 */
export const openBusinessInvitation = (
    invitations: ObjectDto[],
    callback: (business: ObjectDto) => Promise<void> = async () => {}
) => {
    Modal.open({
        component: BusinessInvitation,
        modalSize: 'sm',
        closable: false,
        props: {
            invitations,
            callback: async (business: ObjectDto) => {
                await callback(business);
                Modal.close();
            },
        },
    });
};
export const openOwnerShiptTransferInvitation = (
    invitations?: ObjectDto[],
    options?: {
        type?: 'vendor_ownership_transfer' | 'meta_vendor_ownership_transfer';
        callback?: (business: ObjectDto) => Promise<void>;
    }
) => {
    return Modal.open({
        component: OwnershipTransferInvitations,
        modalSize: 'sm',
        props: {
            invitations,
            type: options?.type,
            callback: async (business: ObjectDto) => {
                await options?.callback(business);
                Modal.close();
            },
        },
    });
};

/** *
 * This function is directly related to the useGetEmployeeId Hook
 *
 * @description for reference check userGroupdetail.module.tsx.
 *
 * @param navigationFunction This is the function call from getEmployeeidHook
 * @param manager_id id
 *
 * @returns Navigate to the employee page
 */
export const handleNavigationEmployeeDetail = (
    navigationFunction: (
        __: number,
        _: (_: any) => void
    ) => Promise<void> | void,
    manager_id: number
) => {
    navigationFunction(manager_id, (item) => {
        let url = `${FINOPS_EMPLOYEE_DETAIL}/${item?.id}`;
        if (!Menu.isMenuAvailable(url)) return;
        return Navigation.navigate({
            url,
        });
    });
};
/**
 * Lazy load page component.
 *
 * @param fn `function` import function.
 * @param ssr `boolean` enable server side rendering.
 * @returns any
 */
export const loadDynamicPage = (
    fn: () => any,
    ssr: boolean = false,
    progress: boolean = true,
    options?: {
        isComponent?: boolean;
    }
): any => {
    return dynamic<any>(fn, {
        loading: progress
            ? () => (
                  <PageLoader
                      className={
                          options?.isComponent === true ? 'h-[300px]' : ''
                      }
                      screenHeight={options?.isComponent !== true}
                  />
              )
            : () => <span></span>,
        ssr: ssr,
    }) as any;
};

export const openSavedFilters = (
    definitionKey: string,
    options?: {
        callback?: () => Promise<any>;
        refetchPreferences?: () => Promise<any>;
        listFilters?: ObjectDto[];
    }
) => {
    const { callback, refetchPreferences } = options || {};
    Modal.open({
        component: SavedFilters,
        modalSize: 'md',
        props: {
            definitionKey,
            callback,
            refetchPreferences,
            listFilters: options?.listFilters,
        },
    });
};

/**
 * Generate Random number.
 *
 * @param digits `number` Number of digits
 * @returns number
 */
export const generateRandomNumber = (digits: number = 16): number => {
    const min = Math.ceil(Math.pow(10, digits - 1));
    const max = Math.ceil(Math.pow(10, digits) - 1);

    return Math.floor(Math.random() * (max - min)) + min;
};

export const openImageCropper = (
    file_url: string,
    options: Partial<Omit<any, 'file' | 'onClose' | 'callback'>>,
    callback = (_: ObjectDto) => {}
) => {
    Modal.open({
        component: ImageCropper,
        modalSize: 'sm',
        props: {
            file: file_url,
            ...options,
            onClose: () => {
                Modal.close();
            },
            callback: async (data) => {
                const { hide = () => {} } = Toast.loading({
                    description: 'Saving...',
                });
                const file = await fetch(data)
                    .then((res) => res.blob())
                    .then((blob) => {
                        return new File(
                            [blob],
                            String(generateRandomNumber(8)) + '.png',
                            {
                                type: 'image/png',
                            }
                        );
                    });

                const uploadedImages = await ProcessUploadData({
                    images: [file],
                    resolve: true,
                    uploadFile: true,
                });

                hide();

                if (uploadedImages.length > 0) {
                    callback(uploadedImages[0]);
                    Modal.close();
                }
            },
        },
    });
};

export const openChangeOrganizationName = ({
    callback = EmptyFunction,
    data,
}: any) => {
    SlidingPane.open({
        component: ChangeOrgNameForm,
        props: {
            callback: (response) => {
                SlidingPane.close();
                const tempBusiness = UserBusiness.getCurrentBusiness();

                UserBusiness.setCurrentBusiness({
                    ...tempBusiness,
                    name: response?.name,
                });
                fetchBusinesses();
                callback(response);
            },
            data,
        },
    });
};

export const openAddNotes = (
    data: any = {},
    callback: () => void = EmptyFunction,
    options: {
        type: GenericListingType;
        type_id: any;
        withVendorVisible?: boolean;
    }
) => {
    AddNotesForm({
        data,
        callback: (_: CommentCreationPayload) => {
            callback();
        },
        ...options,
    });
};

export const openAddIntegrationContactPerson = (
    data: any = {},
    callback: () => void = EmptyFunction,
    options: {
        type: GenericListingType;
        type_id: number;
    }
) => {
    AddContactPersonForm({ data, options });
};

export const openAddDocuments = (
    type: GenericListingType,
    type_id: number,
    callback = (_: any) => {},
    data?: any,
    defaultClassName?: any
) => {
    const formSchema: FormBuilderFormSchema = {
        files: {
            type: 'small_multiple_file_upload',
            multiple: true,
            required: true,
            btnSize: 'sm',
            label: 'Files',
            name: 'files',
        },
        comments: {
            type: 'textarea',
            placeholder: 'Document Message',
            name: 'comment',
            label: 'Comment',
            required: false,
        },
    };

    const apiSchema: ApiSchema = {
        controller: defaultClassName || LISTING_CONTROLLER_ROUTER[type],
        method: 'createDocument',
        methodParams: type_id,
        onSuccess: (res) => {
            RefetchGenericListing();
            callback({ document_url: res?.[0]?.document_url });
        },
        sanitizeClassParamsData(values) {
            const { files: fileValues } = values;
            const files = [];
            for (const file of fileValues) {
                const {
                    serverUrl: document_url,

                    attributes,
                    ...rest
                } = file || {};

                files.push({
                    comments: values.comments,
                    document_url: document_url || file?.document_url,
                    attributes: attributes,
                    ...rest,
                });
            }
            return { files };
        },
    };

    return new ModalFormUtil(formSchema, apiSchema).process({
        modal_type: 'slidingPanel',
        title: 'Upload Documents',
        slidingPanelProps: {},
        formBuilderProps: {},
        initialValues: data,
    });
};

export const openAddDocumentLocal = (
    callback = (_: DocumentUploadResponsePayload) => {},
    data?: any
) => {
    SlidingPane.open({
        component: AddDocumentsFormLocal,
        props: {
            callback: (data: DocumentUploadResponsePayload) => {
                callback(data);
                SlidingPane.close();
            },
            data,
        },
    });
};

export const openPriorityChanger = ({
    callback = () => {},
    ...rest
}: PriorityChangerProps) => {
    SlidingPane.open({
        component: PriorityChanger,
        props: {
            ...rest,
            callback: (items: any[]) => {
                SlidingPane.close();
                callback(items);
            },
        },
    });
};

export const openChargebackDetail = (id: number) => {
    Modal.close();
    if (!Menu.isMenuAvailable(`${CHARGEBACK_DETAIL_PAGE_ROUTE}/${id}`)) return;
    Navigation.navigate({ url: `${CHARGEBACK_DETAIL_PAGE_ROUTE}/${id}` });
};

export function copyTextToClipboard(text: string) {
    if (!navigator.clipboard) {
        console.error('Could not copy text');
        return;
    }
    navigator.clipboard.writeText(text).then(
        function () {
            console.info('Async: Copying to clipboard was successful!');
        },
        function (err) {
            console.error('Async: Could not copy text: ', err);
        }
    );
}

export const openEmailMessageDetail = (
    id: number,
    product_id: PRODUCT_IDENTIFIER
) => {
    Modal.close();
    if (
        !Menu.isMenuAvailable(`${FINOPS_EMAIL_MESSAGES_LIST_ROUTE}`) &&
        !Menu.isMenuAvailable(`${EMPLOYEE_EMAIL_MESSAGES_LIST_ROUTE}`)
    )
        return;

    if (product_id === PRODUCT_IDENTIFIER.FINOPS) {
        Navigation.navigate({
            url: `${FINOPS_EMAIL_MESSAGES_LIST_ROUTE}?split_view=${id}`,
        });
        return;
    }
    Navigation.navigate({
        url: `${EMPLOYEE_EMAIL_MESSAGES_LIST_ROUTE}?split_view=${id}`,
    });
};

export const openGSTR2bDetail = (id: number) => {
    Modal.close();
    if (!Menu.isMenuAvailable(`${FINOPS_GSTR2_ITEM_DETAIL_ROUTE}/${id}`))
        return;
    Navigation.navigate({
        url: `${FINOPS_GSTR2_ITEM_DETAIL_ROUTE}/${id}`,
    });
};

export const openRecurringDetail = (id: number, isExpense?: boolean) => {
    Modal.close();
    if (
        !Menu.isMenuAvailable(`${FINOPS_RECURRING_EXPENSE_ROUTE}/d/[id]`) &&
        !Menu.isMenuAvailable(`${FINOPS_RECURRING_ADVANCE_ROUTE}/d/[id]`)
    )
        return;

    if (isExpense) {
        Navigation.navigate({
            url: `${FINOPS_RECURRING_EXPENSE_ROUTE}/d/${id}`,
        });
        return;
    }
    Navigation.navigate({
        url: `${FINOPS_RECURRING_ADVANCE_ROUTE}/d/${id}`,
    });
};

export const openAggregateDetails = (
    func: string,
    column: ObjectDto,
    data: ObjectDto
) => {
    Modal.open({
        component: AggregateDetails,
        modalSize: 'sm',
        props: {
            func,
            column,
            data,
        },
    });
};

export const openDetailDataNotFound = () => {
    Modal.open({
        component: NoDataFound,
        closeIcon: false,
        props: {
            title: 'No Data found',
            description: (
                <button
                    className='link link-hover'
                    onClick={() => {
                        Navigation.back();
                        Modal.closeAll();
                    }}
                >
                    Go to previous{' '}
                </button>
            ),
        },
    });
};

export const getPercentageIcon = (is_percentage?: boolean) => {
    if (!is_percentage) return <></>;
    return <Icon source={PercentageSquareSvgIcon} isSvg />;
};

export const getOtherDocumentMessage = (is_other_document: boolean) => {
    if (!is_other_document) return <></>;
    return (
        <div className='pl-2 mt-2 text-sm text-base-secondary'>
            If you want support for other documents please write to us at:
            <a href='mailto:query@finnoto.com' className='link link-hover'>
                query@finnoto.com
            </a>
        </div>
    );
};

export const openShortCutKeys = () => {
    return Modal.open({
        component: ShortCutPanel,
    });
};

export const openDepartmentDetail = (department_id: number) => {
    return Navigation.navigate({
        url: `${FINOPS_DEPARTMENT_DETAIL_ROUTE}/${department_id}`,
    });
};
export const openDesignationDetail = (designation_id: number) => {
    return Navigation.navigate({
        url: `${FINOPS_DESIGNATION_DETAIL_ROUTE}/${designation_id}`,
    });
};
export const openEmployeeDetail = (employee_id: number) => {
    return Navigation.navigate({
        url: `${FINOPS_EMPLOYEE_DETAIL}/${employee_id}`,
    });
};
export const openExpenseHeadDetail = (id: number) => {
    return Navigation.navigate({
        url: `${FINOPS_EXPENSE_HEAD_DETAIL_ROUTE}/${id}`,
    });
};
export const openExpenseDetail = (id: number) => {
    return Navigation.navigate({
        url: `${FINOPS_EXPENSE_DETAILS_ROUTE}/${id}`,
    });
};

export const openCommonKeyValueList = (props: {
    title?: string;
    isDefination?: boolean;
    queryFn?: CommonKeyValueQueryFnType;
    handleStatus?: any;
    topColumnKey?: string;
}) => {
    return SlidingPane.open({
        component: CommonKeyValueList,
        size: 'md',
        props,
    });
};
export const openCommonKeyValueListTable = (props: {
    title?: string;
    queryFn?: CommonKeyValueTableQueryFnType;
}) => {
    return Modal.open({
        component: CommonKeyValueListTable,
        modalSize: 'wide',
        props,
    });
};

export const openImageViewer = (
    images: any[],
    options?: {
        initialImage?: number;
        title?: string;
        onClickToDelete?: (data?: any) => void;
        addedAt?: string;
        addedBy?: string;
        popUpOff?: boolean;
        imageClassName;
    }
) => {
    const {
        initialImage: initialImage,
        title,
        onClickToDelete,
        addedBy,
        addedAt,
        popUpOff,
        imageClassName,
    } = options || {};

    Modal.open({
        modalSize: 'full',
        className: 'bg-black/60',
        closeClassName: 'text-white',
        component: ImageViewer,
        props: {
            images,
            initialImage,
            title,
            addedBy,
            addedAt,
            onClickToDelete,
            popUpOff,
            imageClassName,
        },
    });
};

export const getInvitationStatusLabel = (status_id: number) => {
    switch (status_id) {
        case ApprovalStatusTypeEnum.PENDING:
            return (
                <Badge
                    label='Pending'
                    size='normal'
                    appearance='warning'
                    className='status'
                />
            );
        case ApprovalStatusTypeEnum.APPROVED:
            return (
                <Badge
                    label='Approved'
                    size='normal'
                    appearance='success'
                    className='status'
                />
            );
        case ApprovalStatusTypeEnum.REJECTED:
            return (
                <Badge
                    label='Rejected'
                    size='normal'
                    appearance='error'
                    className='status'
                />
            );
    }
};

export const getSimilarityScore = (
    similarity_score: number,
    options: ObjectDto = {}
) => {
    const percentage = Math.round((similarity_score || 0) * 100);
    return (
        <div className='col-flex'>
            <span className='text-xs leading-[14px] text-success'>
                {percentage}%
            </span>
            <Progress
                value={percentage}
                className='h-[6px]'
                backgroundColor='base'
                indicatorColor='success'
            />
        </div>
    );
};
export const openReportDetailModal = (props: DashboardReportModalProps) => {
    Modal.open({
        component: GenericDashboardReportModal,
        modalSize: 'xl',
        props,
    });
};

export const formatPeriod = (period) => {
    const strPeriod = period?.toString();
    const year = strPeriod?.slice(0, 4);
    const month = strPeriod?.slice(4, 6);
    const formattedPeriod = format(new Date(`${year}-${month}-01`), 'MMM yyyy');
    return <p>{period ? formattedPeriod : '-'}</p>;
};

export const openLargeFileUploadModal = ({
    title,
    onUploadingFile,
    onSave,
    onSkip,
    isMultiple,
    ...rest
}: LargeFileUploadInterface) => {
    Modal.open({
        modalSize: 'lg',
        component: LargeFilesUploader,
        shouldWarnFormUpdate: true,
        closeWarningText: `If you close this then your process is going  on background processing.`,
        props: {
            title,
            onUploadingFile,
            onSave: (response) => {
                onSave?.(response);
                Modal.close();
            },
            onSkip,
            isMultiple,

            ...rest,
        },
        onClose: () => {
            StoreEvent({
                eventName: CANCEL_API_REQUEST,
            });
        },
    });
};

export const SupportedUrlDocument = (files: any) => {
    if (!files?.length) return <></>;
    return (
        <span
            onClick={() => openFullViewImage(files, 0)}
            className='text-xs link link-hover'
        >
            {files?.length} supported documents
        </span>
    );
};
export const openVendorDetailPage = (id: number) => {
    return Navigation.navigate({
        url: `${FINOPS_VENDOR_DETAIL_ROUTE}/${id}`,
    });
};

export function getEmployeeReportBreadcrumbData({ name }: { name: string }) {
    return [
        {
            name: 'Home',
            link: EMPLOYEE_EXPENSE_DASHBOARD_ROUTE,
            className: 'text-base-tertiary',
        },
        {
            name: 'Reports',
            link: EMPLOYEE_REPORT_ROUTE,
            className: 'text-base-tertiary',
        },
        {
            name: name,
        },
    ];
}

export const openBulkUpload = (
    typeId: number,
    { name, callback }: { name: string; callback?: () => void }
) => {
    Modal.open({
        component: BulkUploadModal,
        modalSize: 'md',
        props: {
            name: name,
            typeId,
            callback: () => {
                callback();
                Modal.close();
                RefetchGenericListing();
            },
        },
    });
};

export const openArUserDetailsModal = async (user_id: number) => {
    Modal.open({
        component: UserDetailsModal,
        modalSize: 'sm',
        props: {
            id: user_id,
        },
    });
};

export const toastBackendErrorModal = (
    response: any,
    defaultMessage?: string
) => {
    return Modal.open({
        component: BackendErrorModal,
        props: { response, defaultMessage },
        modalSize: 'auto',
    });
};

export const getInboxFromWaId = async (wa_id: string) => {
    const { hide } = Toast.loading({ description: 'Getting inbox detail...' });

    const { response, success } = await FetchData({
        className: TeamInboxController,
        method: 'showMobile',
        methodParams: wa_id,
    });

    hide();

    if (success) return response;
    return toastBackendError(undefined, 'Team inbox is not setup yet');
};
