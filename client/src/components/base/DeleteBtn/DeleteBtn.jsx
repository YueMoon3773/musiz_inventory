import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';
import { DeleteIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const deleteBtnSchema = z.object({
    isDisabled: z.boolean().default(false),
    targetId: z.number().or(z.string()),
    onClickHandler: z.function().optional(),
});

const DeleteBtn = ({ isDisabled = false, targetId, onClickHandler }) => {
    return (
        <button
            className={`${pageStyles.mainBtn} ${isDisabled === true ? pageStyles.btnDisabled : pageStyles.deleteBtn}`}
            onClick={(e) => {
                e.preventDefault();
                if (isDisabled) return;
                onClickHandler(targetId);
            }}
        >
            <DeleteIcon></DeleteIcon>
            Delete
        </button>
    );
};

export default ValidatedComponent(DeleteBtn, deleteBtnSchema);
