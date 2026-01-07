import { EditIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const EditBtn = () => {
    return (
        <button className={`editBtn ${pageStyles.mainBtn}`}>
            <EditIcon></EditIcon>
            Edit
        </button>
    );
};

export default EditBtn;
