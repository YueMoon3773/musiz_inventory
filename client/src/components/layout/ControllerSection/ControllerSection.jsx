import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';

import { AddIcon } from '../../../assets/svg/svgIcons';
import Selection from '../../base/Selection/Selection';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';
import './ControllerSection.scss';

const controllerSectionSchema = z.object({
    pageType: z.string().nullable(),
});

const ControllerSection = ({ pageType }) => {
    const sortField = ['Song title', 'Artist', 'Genre'];
    const sortOrder = ['Ascending (Low to High)', 'Descending (High to Low)'];
    const navigate = useNavigate();
    // const { pageType } = useParams();
    // console.log(pageType);

    return (
        <div className="controllerWrapper">
            <div className="leftController">
                {pageType === 'genres' || pageType === 'artists' ? (
                    ''
                ) : (
                    <Selection
                        selectionLabel={'Sort by'}
                        selectionId={'sortField'}
                        selectionType={'sortField'}
                        selectionOptsList={sortField}
                    ></Selection>
                )}

                <Selection
                    selectionLabel={'Sort direction'}
                    selectionId={'sortOrder'}
                    selectionType={'sortOrder'}
                    selectionOptsList={sortOrder}
                ></Selection>
            </div>
            <div className="rightController">
                <button className={`${pageStyles.mainBtn}`} onClick={() => navigate('/create_song')}>
                    <AddIcon></AddIcon> Add new
                    {pageType === 'songs' && ' song'}
                    {pageType === 'genres' && ' genre'}
                    {pageType === 'artists' && ' artist'}
                </button>
            </div>
        </div>
    );
};

// export default ControllerSection;
export default ValidatedComponent(ControllerSection, controllerSectionSchema);
