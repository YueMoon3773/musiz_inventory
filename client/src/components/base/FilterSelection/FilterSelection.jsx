import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';

const filterSelectionSchema = z.object({
    key: z.union([z.string(), z.number()]).nullable(),
    data: z.looseObject({}),
});

const FilterSelection = (key, data) => {
    return (
        <option key={key} value={data.id}>
            {data.artist}
        </option>
    );
};

// export default ValidatedComponent(FilterSelection, filterSelectionSchema);
export default FilterSelection;
