import PartnerNavbar from './navbar/partner.navbar';

const PartnerModuleWrapper = ({ children }) => {
    return (
        <main className='h-screen bg-white col-flex'>
            <PartnerNavbar />
            <div className='flex-1 bg-base-200'>{children}</div>
        </main>
    );
};

export default PartnerModuleWrapper;
