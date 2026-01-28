import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';
import { AddIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const addBtnSchema = z.object({
    onClickHandler: z.function().optional(),
    children: z.unknown().optional(),
});

const AddBtn = ({ onClickHandler, children }) => {
    return (
        <button
            className={`${pageStyles.mainBtn} ${pageStyles.addBtn}`}
            onClick={(e) => {
                e.preventDefault();
                onClickHandler(e);
            }}
        >
            <AddIcon></AddIcon>
            Add {children}
        </button>
    );
};

export default ValidatedComponent(AddBtn, addBtnSchema);
