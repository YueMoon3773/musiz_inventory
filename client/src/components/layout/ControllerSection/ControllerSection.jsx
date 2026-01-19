import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';

import AddBtn from '../../base/AddBtn/AddBtn';
import Selection from '../../base/Selection/Selection';

import './ControllerSection.scss';

const controllerSectionSchema = z.object({
    pageType: z.string().nullable(),
});

const ControllerSection = ({ pageType }) => {
    const sortField = ['Song title', 'Artist', 'Genre'];
    const sortOrder = ['Ascending (Low to High)', 'Descending (High to Low)'];
    const navigate = useNavigate();

    return (
        <div className="controllerWrapper">
            <div className="leftController">
                {pageType === 'genres' || pageType === 'artists' ? (
                    ''
                ) : (
                    <Selection
                        selectionLabel={'Sort by'}
                        selectionId={'sortField'}
                        selectionValue={sortField[0]}
                        selectionType={'sortField'}
                        selectionOptsList={sortField}
                        selectionOnChangeHandle={() => {}}
                    ></Selection>
                )}

                <Selection
                    selectionLabel={'Sort direction'}
                    selectionId={'sortOrder'}
                    selectionValue={sortOrder[0]}
                    selectionType={'sortOrder'}
                    selectionOptsList={sortOrder}
                    selectionOnChangeHandle={() => {}}
                ></Selection>
            </div>
            <div className="rightController">
                <AddBtn
                    onClickHandler={(e) =>
                        navigate(
                            `/create-${pageType === 'songs' ? 'song' : ''}${pageType === 'genres' ? 'genre' : ''}${
                                pageType === 'artists' ? 'artist' : ''
                            }`,
                        )
                    }
                >
                    {pageType === 'songs' && ' song'}
                    {pageType === 'genres' && ' genre'}
                    {pageType === 'artists' && ' artist'}
                </AddBtn>
            </div>
        </div>
    );
};

// export default ControllerSection;
export default ValidatedComponent(ControllerSection, controllerSectionSchema);
