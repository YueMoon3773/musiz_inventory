import { SubmitIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const SubmitBtn = () => {
    return (
        <button className={`${pageStyles.mainBtn} ${pageStyles.submitBtn}`}>
            <SubmitIcon></SubmitIcon>
            Submit
        </button>
    );
};

export default SubmitBtn;
