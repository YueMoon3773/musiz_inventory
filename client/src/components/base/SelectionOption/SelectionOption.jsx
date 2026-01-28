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
        <option className="selectionOption" value={data.value}>
            {/* {(selectionType === 'sortField' || selectionType === 'sortOrder') && data}
            {(selectionType === 'artists' || selectionType === 'genres') && data} */}
            {data.text}
        </option>
    );
};

export default ValidatedComponent(SelectionOption, selectionOptionSchema);
