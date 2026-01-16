import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';
import { SubmitIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const submitBtnSchema = z.object({
    onClickHandler: z.function(),
});

const SubmitBtn = ({ onClickHandler }) => {
    return (
        <button className={`${pageStyles.mainBtn} ${pageStyles.submitBtn}`} onClick={(e) => onClickHandler(e)}>
            <SubmitIcon></SubmitIcon>
            Submit
        </button>
    );
};

// export default SubmitBtn;
export default ValidatedComponent(SubmitBtn, submitBtnSchema);
