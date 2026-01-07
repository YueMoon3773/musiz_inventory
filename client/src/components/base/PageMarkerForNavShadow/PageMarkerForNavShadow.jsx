import './PageMarkerForNavShadow.scss';

const PageMarkerForNavShadow = ({ refName }) => {
    return <div ref={refName} className="navMarker"></div>;
};

export default PageMarkerForNavShadow;
