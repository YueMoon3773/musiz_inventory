import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';
import { DeleteIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const deleteBtnSchema = z.object({
    isDisabled: z.boolean().default(false),
});

const DeleteBtn = ({ isDisabled = false }) => {
    return (
        <button
            className={`${pageStyles.mainBtn} ${isDisabled === true ? pageStyles.btnDisabled : pageStyles.deleteBtn}`}
        >
            <DeleteIcon></DeleteIcon>
            Delete
        </button>
    );
};

export default ValidatedComponent(DeleteBtn, deleteBtnSchema);
