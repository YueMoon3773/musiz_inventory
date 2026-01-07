import { useTheme } from '../../../hooks/useTheme';

import useHeaderNavShadow from '../../../hooks/useHeaderNavShadow';

import Header from '../Header/Header';
import PageMarkerForNavShadow from '../../base/PageMarkerForNavShadow/PageMarkerForNavShadow';
import PageContent from '../PageContent/PageContent';
import Footer from '../Footer/Footer';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';
import './PageLayout.scss';

const PageLayout = ({ children }) => {
    const { theme } = useTheme();
    const { headerShadow, pageMaker } = useHeaderNavShadow();
    return (
        <div className={`${pageStyles.page}`} data-theme={theme}>
            <Header headerShadow={headerShadow}></Header>
            <PageMarkerForNavShadow refName={pageMaker}></PageMarkerForNavShadow>
            <PageContent>{children}</PageContent>
            <Footer></Footer>
        </div>
    );
};

export default PageLayout;
