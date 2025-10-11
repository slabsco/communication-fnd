'use client';

import Image from 'next/image';
import { useState } from 'react';

import {
    FormBuilderSubmitType,
    LOGIN_ROUTE,
    Navigation,
    ObjectDto,
} from '@finnoto/core';
import {
    Button,
    Card,
    CardBody,
    Icon,
    InputField,
    Modal,
    PageLoader,
    Toast,
} from '@finnoto/design-system';

import { BusinessSvgIcon, VendorAddBusiness } from 'assets';

const BusinessOnboarding = ({
    callback = () => {},
    data: userData = {},
}: {
    callback: (business: ObjectDto) => void;
    data?: ObjectDto;
}) => {
    const { user: { access_token, api_url } = {} } = userData || {};
    const [loading, setLoading] = useState(false);
    const [orgName, setOrgName] = useState('');
    const [selectedAccountType, setSelectedAccountType] =
        useState<string>('business_account');

    const handleSubmit: FormBuilderSubmitType = async () => {
        setLoading(true);
        try {
            const requestBody = {
                name: orgName,
                is_partner_account: selectedAccountType === 'partner_account',
            };

            const response = await fetch(`${api_url}api/business/on-board`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something Went Wrong!!');
            }

            setLoading(false);
            callback(data);
        } catch (error) {
            setLoading(false);
            Toast.error({
                description: error.message || 'Something Went Wrong!!',
            });
        }
    };

    const accountTypes = [
        {
            key: 'business_account',
            label: 'Business Account',
            icon: BusinessSvgIcon,
            description:
                'Perfect for companies looking to manage their internal communications, customer support, and team collaboration.',
            features: [
                'Team Management',
                'Customer Support',
                'Internal Communication',
                'Analytics Dashboard',
            ],
        },
        {
            key: 'partner_account',
            label: 'Partner Account',
            icon: VendorAddBusiness,
            description:
                'Ideal for service providers, agencies, and consultants who manage multiple client communications.',
            features: [
                'Multi-Client Management',
                'White-label Solutions',
                'Advanced Reporting',
                'Partner Portal',
            ],
        },
    ];

    return (
        <div className='px-8 py-6 gap-6 col-flex w-[680px]  modal-bg dark:bg-base-100'>
            {loading ? (
                <div className='flex justify-center items-center h-96'>
                    <PageLoader />
                </div>
            ) : (
                <>
                    {/* Header Section */}
                    <div className='gap-4 text-center col-flex'>
                        <div className='flex justify-center items-center mx-auto w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full dark:from-blue-900/20 dark:to-indigo-900/20'>
                            <Image
                                src={'/logo.png'}
                                alt='Brand Logo'
                                height={150}
                                width={150}
                                style={{
                                    objectFit: 'contain',
                                    objectPosition: 'left',
                                }}
                                unoptimized
                                priority
                            />
                        </div>
                        <div className='gap-2 col-flex'>
                            <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                                Welcome to Your Journey
                            </h1>
                            <p className='mx-auto max-w-md text-sm text-gray-600 dark:text-gray-400'>
                                {"Let's"} set up your organization and choose
                                the perfect account type for your needs
                            </p>
                        </div>
                    </div>

                    {/* Account Type Selection */}
                    <div className='gap-4 col-flex'>
                        <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
                            Choose Your Account Type
                        </h2>

                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            {accountTypes.map((accountType) => (
                                <Card
                                    key={accountType.key}
                                    className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-lg ${
                                        selectedAccountType === accountType.key
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                    onClick={() =>
                                        setSelectedAccountType(accountType.key)
                                    }
                                >
                                    <CardBody className='p-6'>
                                        <div className='gap-4 col-flex'>
                                            <div className='gap-3 items-center row-flex'>
                                                <div
                                                    className={`p-2 rounded-lg ${
                                                        selectedAccountType ===
                                                        accountType.key
                                                            ? 'bg-blue-100 dark:bg-blue-800'
                                                            : 'bg-gray-100 dark:bg-gray-800'
                                                    }`}
                                                >
                                                    <Icon
                                                        source={
                                                            accountType.icon
                                                        }
                                                        isSvg
                                                        size={24}
                                                        className={
                                                            selectedAccountType ===
                                                            accountType.key
                                                                ? 'text-blue-600 dark:text-blue-400'
                                                                : 'text-gray-600 dark:text-gray-400'
                                                        }
                                                    />
                                                </div>
                                                <h3
                                                    className={`font-medium ${
                                                        selectedAccountType ===
                                                        accountType.key
                                                            ? 'text-blue-900 dark:text-blue-100'
                                                            : 'text-gray-900 dark:text-white'
                                                    }`}
                                                >
                                                    {accountType.label}
                                                </h3>
                                            </div>

                                            <p className='text-sm leading-relaxed text-gray-600 dark:text-gray-400'>
                                                {accountType.description}
                                            </p>

                                            <div className='gap-2 col-flex'>
                                                <p className='text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400'>
                                                    Key Features:
                                                </p>
                                                <div className='flex flex-wrap gap-1'>
                                                    {accountType.features.map(
                                                        (feature, index) => (
                                                            <span
                                                                key={index}
                                                                className={`px-2 py-1 text-xs rounded-full ${
                                                                    selectedAccountType ===
                                                                    accountType.key
                                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                                }`}
                                                            >
                                                                {feature}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Organization Name Input */}
                    <div className='gap-4 col-flex'>
                        <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
                            Organization Details
                        </h2>
                        <div className='gap-2 col-flex'>
                            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Organization Name
                            </label>
                            <InputField
                                value={orgName}
                                onChange={setOrgName}
                                maxLength={60}
                                placeholder='Enter your organization name'
                                name='organization_name'
                                className='w-full'
                            />
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                This will be displayed across your communication
                                platform
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                        <Button
                            className='flex-1 normal-case'
                            appearance='base'
                            onClick={() => Modal.close()}
                        >
                            Cancel
                        </Button>
                        <Button
                            className='flex-1 normal-case'
                            appearance='primary'
                            onClick={handleSubmit}
                            disabled={orgName.length < 3}
                        >
                            Create Organization
                        </Button>
                    </div>

                    {/* Footer Link */}
                    <div className='text-center'>
                        <button
                            onClick={() => {
                                Modal.close();
                                Navigation.navigate({ url: LOGIN_ROUTE });
                            }}
                            className='text-sm text-blue-600 transition-colors duration-200 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                        >
                            Login with different user
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BusinessOnboarding;
