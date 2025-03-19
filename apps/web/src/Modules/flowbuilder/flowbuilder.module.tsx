import { FlowBuilderProvider } from './flowbuilder.context';
import FlowBuilderMain from './flowbuilder.main';
import FlowBuilderPanel from './flowbuilder.panel';

const FlowBuilderModule = () => {
    return (
        <div className='flex overflow-hidden items-center w-screen h-content-screen'>
            <FlowBuilderProvider>
                <FlowBuilderPanel />
                <FlowBuilderMain />
            </FlowBuilderProvider>
        </div>
    );
};

export default FlowBuilderModule;
