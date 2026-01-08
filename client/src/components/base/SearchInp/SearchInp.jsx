import React from 'react';
import { z } from 'zod';

import { ClearInpIcon, SearchIcon } from '../../../assets/svg/svgIcons';
import ValidatedComponent from '../../../utils/validateComponentProps';
import './SearchInp.scss';

const searchInpSchema = z.object({
    searchInpId: z.string(),
    searchInpPlaceholder: z.string().default('Search'),
    searchInpState: z.string(),
    searchInpOnChangeHandler: z.function(),
    clearSearchInpHandler: z.function(),
});

const SearchInp = ({
    searchInpId,
    searchInpPlaceholder = 'Search',
    searchInpState,
    searchInpOnChangeHandler,
    clearSearchInpHandler,
}) => {
    return (
        <div className="searchInpWrapper">
            <input
                name={searchInpId}
                id={searchInpId}
                type="text"
                placeholder={searchInpPlaceholder}
                value={searchInpState}
                onChange={(e) => {
                    searchInpOnChangeHandler(e.target.value);
                }}
            />
            <button
                className="clearSearchBtn"
                onClick={() => {
                    const searchInp = document.querySelector(`#${searchInpId}`);
                    clearSearchInpHandler();
                    searchInp.focus();
                }}
            >
                <ClearInpIcon></ClearInpIcon>
            </button>
            <button type="submit" className="searchBtn">
                <SearchIcon />
            </button>
        </div>
    );
};

export default ValidatedComponent(SearchInp, searchInpSchema);
