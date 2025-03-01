import { useUserHook } from '../user.hook';
import { useBusinessPreference } from './useBusinessPreference.hook';

export const useLandingPage = () => {
    const { businessInfo, healthStatusData, isBusinessInfoLoading } =
        useBusinessPreference();

    const { user } = useUserHook();
    return { user, businessInfo, healthStatusData, isBusinessInfoLoading };
};
