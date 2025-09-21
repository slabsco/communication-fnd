import { useBusinessSetting } from '@finnoto/core';
import { Loading } from '@finnoto/design-system';

import BooleanPreferenceCard from './components/business.preference.card';

const BusinessSettings = () => {
    const { data, isLoading, setSettings } = useBusinessSetting();
    const { is_private_number } = data || {};

    if (isLoading) {
        return (
            <div className='w-full h-full centralize'>
                <Loading color='primary' size='xl' />
            </div>
        );
    }

    return (
        <div className='grid grid-cols-2 p-2 space-y-6'>
            <BooleanPreferenceCard
                title='Mask Phone Numbers'
                tooltipMessage='When enabled, phone numbers in messages will be partially hidden (e.g., +1*****1234) to protect customer privacy'
                checked={is_private_number}
                onChange={(checked) =>
                    setSettings({ is_private_number: checked })
                }
            />
        </div>
    );
};

export default BusinessSettings;
