import React from 'react';
import { z } from 'zod';

import { SearchIcon } from '../../../assets/svg/svgIcons';
import ValidatedComponent from '../../../utils/validateComponentProps';
import './SearchInp.scss';

const searchInpSchema = z.object({
    searchInpId: z.string(),
    searchInpPlaceholder: z.string(),
});

const SearchInp = ({ searchInpId, searchInpPlaceholder = 'Search' }) => {
    return (
        <div className="searchInpWrapper">
            <input name={searchInpId} id={searchInpId} type="text" placeholder={searchInpPlaceholder} />
            <button type="submit">
                <SearchIcon />
            </button>
        </div>
    );
};

export default ValidatedComponent(SearchInp, searchInpSchema);
