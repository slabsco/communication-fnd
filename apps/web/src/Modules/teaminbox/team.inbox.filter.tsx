import { IndexFilter } from '@finnoto/design-system';
import { IndexFilterProps } from '@finnoto/design-system/src/Components/Data-display/IndexFilter/indexFilter.types';

export const TeamInboxTabFilter = [
    {
        title: 'Assigned to me',
        key: 'assign_me',
        customFilterValue: {
            assign_me: true,
        },
    },
    {
        title: 'Bot Mode',
        key: 'is_assigned_to_bot',
        customFilterValue: {
            is_assigned_to_bot: true,
        },
    },
];

const TeamInboxFilter = () => {
    const props: IndexFilterProps = {
        definitionKey: 'team_inbox',
        filterTabs: TeamInboxTabFilter,
        className: 'w-full',
    };
    return <IndexFilter {...props} />;
};

export default TeamInboxFilter;
