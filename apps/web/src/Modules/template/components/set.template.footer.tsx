import { InputField } from '@finnoto/design-system';

import { useTemplate } from '../template.context';

const SetTemplateFooter = () => {
    const { state, dispatch } = useTemplate();
    const { text } =
        state.components?.find((_component) => _component?.type === 'FOOTER') ||
        {};
    return (
        <InputField
            placeholder={'Enter Text'}
            label='Footer'
            maxLength={60}
            onChange={(v) => dispatch({ type: 'UPDATE_FOOTER', payload: v })}
            value={text}
        />
    );
};

export default SetTemplateFooter;
