import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';
import { EditIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const editBtnSchema = z.object({
    isDisabled: z.boolean().default(false),
    onClickHandler: z.function().optional(),
});

const EditBtn = ({ isDisabled = false, onClickHandler }) => {
    return (
        <button
            className={`${pageStyles.mainBtn} ${isDisabled === true ? pageStyles.btnDisabled : pageStyles.editBtn}`}
            onClick={(e) => {
                e.preventDefault();
                if (isDisabled) return;
                onClickHandler();
            }}
        >
            <EditIcon></EditIcon>
            Edit
        </button>
    );
};

export default ValidatedComponent(EditBtn, editBtnSchema);
