import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';

import './FormInp.scss';

const formInpSchema = z.object({
    inpLabel: z.string(),
    inpName: z.string(),
    inpState: z.string(),
    inpOnChangeHandler: z.function(),
});

const FormInp = ({ inpLabel, inpName, inpState, inpOnChangeHandler }) => {
    // console.log({ inpState });

    return (
        <label htmlFor={`${inpName}`} className={'formInp'}>
            {inpLabel}
            <input
                name={`${inpName}`}
                id={`${inpName}`}
                value={inpState}
                onChange={(e) => {
                    inpOnChangeHandler(e.target.value);
                }}
                type="text"
            />
        </label>
    );
};

export default ValidatedComponent(FormInp, formInpSchema);
// export default FormInp;
