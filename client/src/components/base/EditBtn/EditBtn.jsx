import { EditIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const EditBtn = () => {
    return (
        <button className={`${pageStyles.mainBtn} ${pageStyles.editBtn}`}>
            <EditIcon></EditIcon>
            Edit
        </button>
    );
};

export default EditBtn;
