import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';

import './SelectionOption.scss';

const selectionOptionSchema = z.object({
    selectionType: z.string(),
    data: z.string().or(z.looseObject({})),
});

const SelectionOption = ({ selectionType, data }) => {
    // console.log({ selectionType, data });

    return (
        <option
            className="selectionOption"
            value={selectionType === 'genres' || selectionType === 'artists' ? data : data.value}
        >
            {selectionType === 'genres' || selectionType === 'artists' ? data : data.text}
            {/* {data.text} */}
        </option>
    );
};

export default ValidatedComponent(SelectionOption, selectionOptionSchema);
