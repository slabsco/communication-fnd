import {
    AdminWrapperProps,
    FormBuilderElementProps,
    PageLoaderProps,
} from '../Types';

interface InitUIProps {
    adminWrapperComponent?: React.FC<AdminWrapperProps>;
    partnerModuleWrapper?: React.FC<AdminWrapperProps>;
    arcAdminWrapperComponent?: React.FC<AdminWrapperProps>;
    pageLoaderComponent: React.FC<PageLoaderProps>;
    formElementsComponent: React.FC<FormBuilderElementProps>;
    functionMethods?: any;
    themeCustomizerComponent?: React.FC<any>;
    confirmUtilComponent?: (options: any) => void;
    commentConfirmUtilComponent?: (options: any) => void;
    expenseWrapperComponents?: {
        vendor?: React.FC<AdminWrapperProps>;
        employee?: React.FC<AdminWrapperProps>;
        finops?: React.FC<AdminWrapperProps>;
    };
}

let AdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => (
    <>{children}</>
);
let ArcAdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => (
    <>{children}</>
);
let PartnerModuleWrapper: React.FC<AdminWrapperProps> = ({ children }) => (
    <>{children}</>
);
let ExpenseWrappers: {
    vendor?: React.FC<AdminWrapperProps>;
    employee?: React.FC<AdminWrapperProps>;
    finops?: React.FC<AdminWrapperProps>;
} = {};
let PageLoader: React.FC<PageLoaderProps> = () => null;
let Functions: any = null;
let formElements: React.FC<FormBuilderElementProps> = () => null;
let ThemeCustomizer: React.FC<any> = () => null;
let ConfirmUtil: (options: any) => void = () => null;
let CommentConfirmUtil: (options: any) => void = () => null;

export const InitUI = ({
    partnerModuleWrapper,
    adminWrapperComponent,
    arcAdminWrapperComponent,
    expenseWrapperComponents,
    pageLoaderComponent,
    formElementsComponent,
    functionMethods,
    themeCustomizerComponent,
    confirmUtilComponent,
    commentConfirmUtilComponent,
}: InitUIProps) => {
    AdminWrapper = adminWrapperComponent || AdminWrapper;
    ArcAdminWrapper = arcAdminWrapperComponent || ArcAdminWrapper;
    ExpenseWrappers = expenseWrapperComponents || ExpenseWrappers;
    PartnerModuleWrapper = partnerModuleWrapper || PartnerModuleWrapper;
    PageLoader = pageLoaderComponent || PageLoader;
    formElements = formElementsComponent || formElements;
    Functions = functionMethods || Functions;
    ThemeCustomizer = themeCustomizerComponent || ThemeCustomizer;
    ConfirmUtil = confirmUtilComponent || ConfirmUtil;
    CommentConfirmUtil = commentConfirmUtilComponent || CommentConfirmUtil;
};

export {
    AdminWrapper,
    ArcAdminWrapper,
    CommentConfirmUtil,
    ConfirmUtil,
    ExpenseWrappers,
    formElements,
    Functions,
    PageLoader,
    ThemeCustomizer,
    PartnerModuleWrapper,
};
