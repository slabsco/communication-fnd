import { IndexFilter } from '@finnoto/design-system';
import { IndexFilterProps } from '@finnoto/design-system/src/Components/Data-display/IndexFilter/indexFilter.types';

import TeamInboxActionComponent from './components/teaminbox.action.component';
import { TeamInboxTabFilter } from './hooks/useTeamInboxMessageListing.hook';

const TeamInboxFilter = () => {
    const props: IndexFilterProps = {
        definitionKey: 'team_inbox',
        filterTabs: TeamInboxTabFilter,
        className: 'w-full',
        rightTabContent: <TeamInboxActionComponent />,
    };
    return <IndexFilter {...props} />;
};

export default TeamInboxFilter;
