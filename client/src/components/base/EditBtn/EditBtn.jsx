import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';
import { EditIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const editBtnSchema = z.object({
    isDisabled: z.boolean().default(false),
});

const EditBtn = ({ isDisabled = false }) => {
    return (
        <button
            className={`${pageStyles.mainBtn} ${isDisabled === true ? pageStyles.btnDisabled : pageStyles.editBtn}`}
            onClick={() => {
                if (isDisabled) return;
            }}
        >
            <EditIcon></EditIcon>
            Edit
        </button>
    );
};

export default ValidatedComponent(EditBtn, editBtnSchema);
