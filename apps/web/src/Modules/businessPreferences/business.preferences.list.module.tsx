import { HOME_ROUTE, useCustomQueryList } from '@finnoto/core';
import { Breadcrumbs, Container, Table } from '@finnoto/design-system';

import { UpdateBusinessPreferenceForm } from './update.business.preference.form.util';

import { EditSvgIcon } from 'assets';

const BusinessPreferencesListModule = () => {
    const { data, isLoading, refetch } = useCustomQueryList({
        type: 'business_preference',
        method: 'getAll',
    });
    return (
        <Container className='overflow-hidden gap-2 py-6 h-content-screen col-flex'>
            <div className='flex gap-2 justify-between items-center'>
                <Breadcrumbs
                    route={[
                        { name: 'Home', link: HOME_ROUTE },
                        { name: 'Business Preferences' },
                    ]}
                />
            </div>

            <Table
                data={data}
                loading={isLoading}
                column={[
                    { name: 'Identifier', key: 'name' },
                    { name: 'Added At', key: 'created_at', type: 'date_time' },
                    {
                        name: 'Preference',
                        key: 'preference',
                        renderValue: (_item) => {
                            return JSON.stringify(_item?.preference);
                        },
                    },
                ]}
                rowNumbering
                pagination={{ display: false }}
                preferences={{
                    stickyHeader: true,
                    stickyRowAction: true,
                    fullHeight: true,
                }}
                rowAction={{
                    menuActions: [
                        {
                            name: 'Edit',
                            icon: EditSvgIcon,
                            action: (data) =>
                                UpdateBusinessPreferenceForm(data, refetch),
                            type: 'outer',
                        },
                    ],
                }}
            />
        </Container>
    );
};

export default BusinessPreferencesListModule;
