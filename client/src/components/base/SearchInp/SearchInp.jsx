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
    handleSearch: z.function(),
});

const SearchInp = ({
    searchInpId,
    searchInpPlaceholder = 'Search',
    searchInpState,
    searchInpOnChangeHandler,
    clearSearchInpHandler,
    handleSearch,
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
                onKeyDown={(e) => {
                    e.preventDefault;
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
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
            <button type="submit" className="searchBtn" onClick={handleSearch}>
                <SearchIcon />
            </button>
        </div>
    );
};

export default ValidatedComponent(SearchInp, searchInpSchema);
