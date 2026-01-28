import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';

import SelectionOption from '../SelectionOption/SelectionOption';

import './Selection.scss';

const selectionSchema = z.object({
    selectionLabel: z.string(),
    selectionId: z.string(),
    selectionType: z.string(),
    selectionOptsList: z.any().array(),
    selectionOnChangeHandle: z.function(),
});

const Selection = ({ selectionLabel, selectionId, selectionType, selectionOptsList, selectionOnChangeHandle }) => {
    // selectionOnChangeHandle(selectionOptsList[0]);
    // console.log(selectionOptsList[0]);

    return (
        <label htmlFor={selectionId} className="selectionLabel">
            {selectionLabel}
            <select
                name={selectionId}
                id={selectionId}
                className="selection"
                onChange={(e) => {
                    // console.log(selectionId + ' ' + e.target.value);
                    selectionOnChangeHandle(e.target.value);
                }}
            >
                {(selectionType === 'sortField' || selectionType === 'sortOrder') &&
                    selectionOptsList.map((item, index) => {
                        return (
                            <SelectionOption
                                key={item.value}
                                selectionType={selectionType}
                                data={item}
                            ></SelectionOption>
                        );
                    })}
                {selectionType === 'artists' &&
                    selectionOptsList.map((item, index) => {
                        return (
                            <SelectionOption
                                key={index}
                                selectionType={selectionType}
                                data={item.artist}
                            ></SelectionOption>
                        );
                    })}

                {selectionType === 'genres' &&
                    selectionOptsList.map((item, index) => {
                        return (
                            <SelectionOption
                                key={index}
                                selectionType={selectionType}
                                data={item.genre}
                            ></SelectionOption>
                        );
                    })}
            </select>
        </label>
    );
};

export default ValidatedComponent(Selection, selectionSchema);
