'use client';

import { useEffect, useState } from 'react';

import {
    FetchData,
    FormBuilderSubmitType,
    GetObjectFromArray,
    IsEmptyArray,
    LOGIN_ROUTE,
    Navigation,
    ObjectDto,
} from '@finnoto/core';
import { MetaBusinessController } from '@finnoto/core/src/backend/meta/controllers/meta.business.controller';
import {
    Button,
    Icon,
    InputField,
    Modal,
    PageLoader,
    Toast,
} from '@finnoto/design-system';

import { OnBoardingImgSvg } from 'assets';

const BusinessOnboarding = ({
    callback = () => {},
    data: userData = {},
}: {
    callback: (business: ObjectDto) => void;
    data?: ObjectDto;
}) => {
    const {
        user: { access_token, api_url },
    } = userData;
    const [loading, setLoading] = useState(false);
    const [orgName, setOrgName] = useState('');

    const handleSubmit: FormBuilderSubmitType = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${api_url}api/business/on-board`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({ name: orgName }),
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

    return (
        <div className=' px-8 py-6 gap-4 col-flex w-[544px] max-h-[480px] modal-bg dark:bg-base-100'>
            {loading ? (
                <PageLoader />
            ) : (
                <>
                    <div className='flex justify-center items-center w-full'>
                        <div className='flex items-center  justify-center h-36 w-36 rounded-full bg-[#4CC3C733] '>
                            <Icon
                                iconClass='flex items-center justify-center'
                                source={OnBoardingImgSvg}
                                isSvg
                                size={88}
                            />
                        </div>
                    </div>
                    <form className='gap-8 col-flex'>
                        <div className='gap-2 text-center col-flex v'>
                            <p className='text-xl font-medium'>
                                Let’s start your business journey
                            </p>
                            <p className='text-sm font-medium'>
                                Create your organization profile
                            </p>
                        </div>
                        <div className='bg-base-100'>
                            <InputField
                                value={orgName}
                                onChange={setOrgName}
                                maxLength={60}
                                placeholder={'Enter your organization name'}
                                name='organization_name'
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <Button
                                className='mt-auto normal-case'
                                block
                                appearance='base'
                                onClick={() => Modal.close()}
                            >
                                Close
                            </Button>
                            <Button
                                className='mt-auto normal-case'
                                block
                                appearance='primary'
                                onClick={handleSubmit}
                                disabled={orgName.length < 3}
                            >
                                Continue
                            </Button>
                        </div>
                        <div className='justify-between items-center mt-2 w-full text-center row-flex'>
                            <a
                                onClick={() => {
                                    Modal.close();
                                    Navigation.navigate({ url: LOGIN_ROUTE });
                                }}
                                className='text-sm cursor-pointer link link-hover'
                            >
                                Login with different user
                            </a>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default BusinessOnboarding;
