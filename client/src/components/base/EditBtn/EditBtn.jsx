import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';
import { EditIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const editBtnSchema = z.object({
    isDisabled: z.boolean().default(false),
    targetId: z.number().or(z.string()),
    onClickHandler: z.function().optional(),
});

const EditBtn = ({ isDisabled = false, targetId, onClickHandler }) => {
    return (
        <button
            className={`${pageStyles.mainBtn} ${isDisabled === true ? pageStyles.btnDisabled : pageStyles.editBtn}`}
            onClick={(e) => {
                e.preventDefault();
                if (isDisabled) return;
                onClickHandler(targetId);
            }}
        >
            <EditIcon></EditIcon>
            Edit
        </button>
    );
};

export default ValidatedComponent(EditBtn, editBtnSchema);
