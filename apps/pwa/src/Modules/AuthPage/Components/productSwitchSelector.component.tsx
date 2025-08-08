import employeeLightTheme from 'themes/expense/employee/light.theme';
import finopsLightTheme from 'themes/expense/finops/light.theme';
import vendorLightTheme from 'themes/expense/vendor/light.theme';
import recoLightTheme from 'themes/reco/light.theme';

import {
    authenticateBusiness,
    Navigation,
    PRODUCT_IDENTIFIER,
    storeProductPathState,
    useApp,
    useAppProducts,
    useUserHook,
} from '@finnoto/core';
import { cn, Icon } from '@finnoto/design-system';

import {
    GradientProductEmployeeSvgIcon,
    GradientProductFinopsSvgIcon,
    GradientProductRecoSvgIcon,
    GradientProductVendorSvgIcon,
    ProductEmployeeSvgIcon,
    ProductFinopsSvgIcon,
    ProductRecoSvgIcon,
    ProductVendorSvgIcon,
} from 'assets';

export const ProductThemesColor = {
    [PRODUCT_IDENTIFIER.RECO]: '#0AE287', // reco
    [PRODUCT_IDENTIFIER.VENDOR]: '#FB7E15', // Expense Vendor
    [PRODUCT_IDENTIFIER.EMPLOYEE]: '#15FBED', // Employee Portal
    [PRODUCT_IDENTIFIER.FINOPS]: '#FB153E', // finOps Portal
};

export const ProductDescription = {
    [PRODUCT_IDENTIFIER.RECO]: 'Platform for payment transaction matching',
    [PRODUCT_IDENTIFIER.VENDOR]:
        'Platform for raising invoice for your clients',
    [PRODUCT_IDENTIFIER.EMPLOYEE]: 'Platform for expenses and reimbursements',
    [PRODUCT_IDENTIFIER.FINOPS]: 'Manage expenses , reimbursements & finance',
};

const ProductSwitchSelector = () => {
    const { product_id } = useApp();
    const { products } = useAppProducts();
    const { user } = useUserHook();
    return (
        <div className='px-4 py-3 col-flex'>
            {(products || []).map((product) => (
                <NewProductCard
                    key={product.id}
                    name={product.name as any}
                    icon={product.id}
                    onClick={() => {
                        storeProductPathState(
                            product_id,
                            Navigation.currentRoute().path
                        );
                        authenticateBusiness(user.business || user.vendor, {
                            product,
                        });
                    }}
                    color={ProductThemesColor[product.id]}
                    isActive={product_id === product.id}
                    desc={ProductDescription[product.id]}
                    size='sm'
                />
            ))}
        </div>
    );
};

export const NewProductCard = ({
    name,
    icon,
    onClick,
    isActive,
    color,
    desc,
    size = 'md',
}: {
    name: string;
    icon: any;
    onClick: () => void;
    isActive?: boolean;
    color?: string;
    desc?: string;
    size?: 'md' | 'sm';
}) => {
    const sizeClass = {
        sm: 'h-[72px] ',
        md: 'h-[72px] ',
    };
    const productIcon = getProductIcons(icon);

    return (
        <div
            onClick={onClick}
            className={cn('hover-productcard', sizeClass[size])}
        >
            <div className='flex gap-4 p-4'>
                {productIcon && (
                    <Icon
                        source={productIcon}
                        isSvg
                        size={24}
                        iconClass='flex justify-center items-center'
                    />
                )}
                <div className='col-flex'>
                    <p className='text-sm font-medium hover-productcard-color'>
                        {name}
                    </p>
                    <span className='text-xs text-base-tertiary hover-productcard-desc'>
                        {desc}
                    </span>
                </div>
            </div>
        </div>
    );
};
export const getProductIcons = (id: number) => {
    switch (id) {
        case PRODUCT_IDENTIFIER.RECO:
            return ProductRecoSvgIcon;
        case PRODUCT_IDENTIFIER.VENDOR:
            return ProductVendorSvgIcon;
        case PRODUCT_IDENTIFIER.EMPLOYEE:
            return ProductEmployeeSvgIcon;
        case PRODUCT_IDENTIFIER.FINOPS:
            return ProductFinopsSvgIcon;
    }
};
export const getProductGradientIcons = (id: number) => {
    switch (id) {
        case PRODUCT_IDENTIFIER.RECO:
            return GradientProductRecoSvgIcon;
        case PRODUCT_IDENTIFIER.VENDOR:
            return GradientProductVendorSvgIcon;
        case PRODUCT_IDENTIFIER.EMPLOYEE:
            return GradientProductEmployeeSvgIcon;
        case PRODUCT_IDENTIFIER.FINOPS:
            return GradientProductFinopsSvgIcon;
    }
};

export default ProductSwitchSelector;
