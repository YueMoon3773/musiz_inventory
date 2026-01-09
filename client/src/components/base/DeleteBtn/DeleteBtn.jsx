import { DeleteIcon } from '../../../assets/svg/svgIcons';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const DeleteBtn = () => {
    return (
        <button className={`${pageStyles.mainBtn} ${pageStyles.deleteBtn}`}>
            <DeleteIcon></DeleteIcon>
            Delete
        </button>
    );
};

export default DeleteBtn;
