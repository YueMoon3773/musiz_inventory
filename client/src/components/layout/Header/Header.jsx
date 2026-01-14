import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { useTheme } from '../../../hooks/useTheme';
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
    const { theme, toggleTheme } = useTheme();
    const [searchText, setSearchText] = useState('');

    const handleChangeSearchText = (searchInpVal) => {
        setSearchText(searchInpVal);
    };

    const clearSearchInpHandler = () => {
        setSearchText('');
    };

    return (
        <div className={`header ${pageStyles.pageHeader} ${headerShadow === true ? 'showShadow' : ''}`}>
            <div className="headerLeft">
                <Link to={'/'} className="logoWrapper">
                    The Musiz Library
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
