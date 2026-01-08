import { useState } from 'react';
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
                    The Musiz Inventory
                    <LogoIcon />
                </Link>
            </div>

            <div className="headerMid">
                <Link to={'/'} className="navLink">
                    <SongsListIcon className="navLinkIcon"></SongsListIcon>
                    Songs
                </Link>
                <Link to={'/genres'} className="navLink">
                    <GenresIcon className="navLinkIcon"></GenresIcon>
                    Genres
                </Link>
                <Link to={'/artists'} className="navLink">
                    <ArtistsIcon className="navLinkIcon"></ArtistsIcon>
                    Artists
                </Link>
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
