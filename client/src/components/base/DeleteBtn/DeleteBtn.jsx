import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';
import { DeleteIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const deleteBtnSchema = z.object({
    isDisabled: z.boolean().default(false),
    onClickHandler: z.function().optional(),
});

const DeleteBtn = ({ isDisabled = false, onClickHandler }) => {
    return (
        <button
            className={`${pageStyles.mainBtn} ${isDisabled === true ? pageStyles.btnDisabled : pageStyles.deleteBtn}`}
            onClick={() => {
                if (isDisabled) return;
                onClickHandler();
            }}
        >
            <DeleteIcon></DeleteIcon>
            Delete
        </button>
    );
};

export default ValidatedComponent(DeleteBtn, deleteBtnSchema);
