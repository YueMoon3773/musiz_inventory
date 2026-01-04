import { Link } from 'react-router-dom';

import { useTheme } from '../../../hooks/useTheme';

import { LogoIcon, LightModeIcon, DarkModeIcon } from '../../../assets/svg/svgIcons';
import SearchInp from '../../base/SearchInp/SearchInp';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';
import './Header.scss';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className={`${pageStyles.pageHeader}`}>
            <Link to={'/'} className="logoWrapper">
                The Musiz Inventory
                <LogoIcon />
            </Link>
            <SearchInp searchInpId={'headerSearchInp'} searchInpPlaceholder={'Search song title, artist,...'} />
            <button onClick={toggleTheme}>
                {theme === 'light' && <LightModeIcon></LightModeIcon>}
                {theme === 'dark' && <DarkModeIcon></DarkModeIcon>}
            </button>
        </div>
    );
};

export default Header;
