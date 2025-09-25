import { Button, Icon, Modal } from '@finnoto/design-system';

import { ErrorSvgIcon } from 'assets';

const BackendErrorModal = ({ response }) => {
    return (
        <div className='gap-3 p-5 centralize col-flex max-w-[300px]'>
            <div className='p-2 rounded-full bg-error/10 text-error-content centralize'>
                <div className='p-4 rounded-full bg-error'>
                    <Icon source={ErrorSvgIcon} isSvg />
                </div>
            </div>
            <p className='font-medium'>{response?.title || 'Request Error'}</p>
            <p className='text-base-secondary'>
                {response?.message ||
                    `An error occurred while processing your request. The following
                message is provided by the server. Please review it or try again
                later.`}
            </p>
            <Button
                defaultMinWidth
                onClick={() => Modal.close()}
                appearance='success'
            >
                Close
            </Button>
        </div>
    );
};

export default BackendErrorModal;
