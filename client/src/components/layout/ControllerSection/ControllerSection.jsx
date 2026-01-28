import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';

import AddBtn from '../../base/AddBtn/AddBtn';
import Selection from '../../base/Selection/Selection';

import './ControllerSection.scss';

const controllerSectionSchema = z.object({
    pageType: z.string().nullable(),
    sortFieldOnChangeHandler: z.function().optional(),
    sortOrderOnChangeHandler: z.function(),
});

const ControllerSection = ({ pageType, sortFieldOnChangeHandler, sortOrderOnChangeHandler }) => {
    const sortField = [
        { value: 'song', text: 'Song title' },
        { value: 'artist', text: 'Artist' },
        { value: 'genre', text: 'Genre' },
    ];
    const sortOrder = [
        { value: 'asc', text: 'Ascending (Low to High)' },
        { value: 'desc', text: 'Descending (High to Low)' },
    ];
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
                        selectionType={'sortField'}
                        selectionOptsList={sortField}
                        selectionOnChangeHandle={sortFieldOnChangeHandler}
                    ></Selection>
                )}

                <Selection
                    selectionLabel={'Sort direction'}
                    selectionId={'sortOrder'}
                    selectionType={'sortOrder'}
                    selectionOptsList={sortOrder}
                    selectionOnChangeHandle={sortOrderOnChangeHandler}
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

export default ValidatedComponent(ControllerSection, controllerSectionSchema);
