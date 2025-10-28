import { useBusinessSetting } from '@finnoto/core';
import { Button, Loading } from '@finnoto/design-system';

import BooleanPreferenceCard from './components/business.preference.card';
import { openSetReminderViewModal } from './components/send.reminder.component';

const BusinessSettings = () => {
    const { data, isLoading, setSettings } = useBusinessSetting();
    const { is_private_number, user_reminder_preference } = data || {};

    if (isLoading) {
        return (
            <div className='w-full h-full centralize'>
                <Loading color='primary' size='xl' />
            </div>
        );
    }

    return (
        <div className='grid grid-cols-2 gap-3 p-2'>
            <BooleanPreferenceCard
                title='Reminder before chat expires'
                description='Before a chat expires, we will send a reminder notification to users.'
            >
                <Button
                    onClick={() =>
                        openSetReminderViewModal({
                            preference: user_reminder_preference,
                            setPreference: (preference) => {
                                setSettings({
                                    user_reminder_preference: preference,
                                });
                            },
                        })
                    }
                    appearance='base'
                >
                    View
                </Button>
            </BooleanPreferenceCard>

            {/* <BooleanPreferenceCard
                title='Mask Phone Numbers'
                description='Partially mask phone numbers in messages (e.g., +1*****1234) to help protect customer privacy.'
                checked={is_private_number}
                onChange={(checked) =>
                    setSettings({ is_private_number: checked })
                }
            /> */}
        </div>
    );
};

export default BusinessSettings;
