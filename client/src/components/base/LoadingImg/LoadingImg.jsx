import LoadingImage from '../../../assets/img/loading.gif';

import './LoadingImg.scss';

const LoadingImg = () => {
    return (
        <div className="loadingImg">
            <img src={LoadingImage} alt="Loading image" />
        </div>
    );
};

export default LoadingImg;
