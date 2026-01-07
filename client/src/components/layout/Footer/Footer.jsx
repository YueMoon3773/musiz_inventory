import { GithubIcon } from '../../../assets/svg/svgIcons';

import './Footer.scss';
import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const Footer = () => {
    return (
        <footer className={`${pageStyles.footer}`}>
            <a href="https://github.com/YueMoon3773" target="_blank" rel="noopener noreferrer" className="footerLink">
                <GithubIcon></GithubIcon>
                Github
            </a>
        </footer>
    );
};

export default Footer;
