import { useQuery } from '@tanstack/react-query';

import { LISTING_CONTROLLER_ROUTER, SOURCEHASH } from '../../Constants';
import { GenericListingType } from '../../Types';
import { GetUniqueObjectsFromArray } from '../../Utils/common.utils';
import { FetchData } from '../useFetchData.hook';

const useUsersContext = ({
    method,
    type,
}: {
    method: string;
    type: GenericListingType;
}) => {
    const { data, isLoading } = useQuery({
        queryKey: ['users_context'],
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: LISTING_CONTROLLER_ROUTER[type],
                method: method,
            });

            if (success) {
                const userArray = response
                    .map((el) => {
                        return {
                            id: el?.id ?? el?.user_id,
                            display: el?.name ?? el?.user?.name,
                            source_type: SOURCEHASH.user,
                            is_ap_user: el?.is_ap_user,
                            email: el?.user?.email,
                            identifier: el?.identifier ?? el?.user?.identifier,
                            active: el?.active,
                        };
                    })
                    .filter((el) => el?.active === true);

                return GetUniqueObjectsFromArray(userArray, 'id');
            }
            return [];
        },
        refetchInterval: 1 * 1000 * 60,
    });

    return { data, isLoading };
};

export default useUsersContext;
