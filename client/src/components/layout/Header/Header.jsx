import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { useTheme } from '../../../hooks/useTheme';
import { useBaseBeUrl } from '../../../hooks/useStorage';
// import { useFetchGetData } from '../../../hooks/useFetchData';
import ValidatedComponent from '../../../utils/validateComponentProps';

import {
    LogoIcon,
    LightModeIcon,
    DarkModeIcon,
    SongsListIcon,
    GenresIcon,
    ArtistsIcon,
} from '../../../assets/svg/svgIcons';
import SearchInp from '../../base/SearchInp/SearchInp';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';
import './Header.scss';

const headerSchema = z.object({
    headerShadow: z.boolean(),
});

const Header = ({ headerShadow }) => {
    const navigate = useNavigate();
    const { baseUrl } = useBaseBeUrl();
    const { theme, toggleTheme } = useTheme();
    const [searchText, setSearchText] = useState('');

    const handleChangeSearchText = (searchInpVal) => {
        setSearchText(searchInpVal);
    };

    const clearSearchInpHandler = () => {
        setSearchText('');
    };

    const handleSearch = async () => {
        const searchUrl = `${baseUrl}/search?searchValue=${searchText.toLowerCase()}`;
        let navigateUrl;

        try {
            const res = await fetch(searchUrl, {
                mode: 'cors',
                method: 'GET',
            });

            const data = await res.json();
            // console.log(data);

            if (res.ok === false) {
                throw new Error("Can't search", { cause: data.errors });
            }

            if (data.beData === null) {
                navigateUrl = `${baseUrl}/not-found`;
            } else {
                navigateUrl = `${baseUrl}/${data.beData.target}-details/${data.beData.data[0].id}`;
            }
            // console.log({ navigateUrl });
            navigate(navigateUrl);
        } catch (err) {
            throw new Error('Request failed', { cause: err });
        }
    };

    return (
        <div className={`header ${pageStyles.pageHeader} ${headerShadow === true ? 'showShadow' : ''}`}>
            <div className="headerLeft">
                <Link to={'/'} className="logoWrapper">
                    <span>The Musiz Library</span>
                    <LogoIcon />
                </Link>
            </div>

            <div className="headerMid">
                <NavLink to="/songs" className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}>
                    <SongsListIcon className="navLinkIcon"></SongsListIcon>
                    Songs
                </NavLink>

                <NavLink to="/genres" className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}>
                    <GenresIcon className="navLinkIcon"></GenresIcon>
                    Genres
                </NavLink>

                <NavLink to="/artists" className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}>
                    <ArtistsIcon className="navLinkIcon"></ArtistsIcon>
                    Artists
                </NavLink>
            </div>

            <div className="headerRight">
                <SearchInp
                    searchInpId={'headerSearchInp'}
                    searchInpPlaceholder={'Search song title, artist,...'}
                    searchInpState={searchText}
                    searchInpOnChangeHandler={handleChangeSearchText}
                    clearSearchInpHandler={clearSearchInpHandler}
                    handleSearch={handleSearch}
                />
                <button className="themeBtn" onClick={toggleTheme}>
                    {theme === 'light' && <LightModeIcon></LightModeIcon>}
                    {theme === 'dark' && <DarkModeIcon></DarkModeIcon>}
                </button>
            </div>
        </div>
    );
};

export default ValidatedComponent(Header, headerSchema);
