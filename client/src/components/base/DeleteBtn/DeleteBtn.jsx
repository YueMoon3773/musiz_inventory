import { DeleteIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const DeleteBtn = () => {
    return (
        <button className={`deleteBtn ${pageStyles.mainBtn}`}>
            <DeleteIcon></DeleteIcon>
            Delete
        </button>
    );
};

export default DeleteBtn;
