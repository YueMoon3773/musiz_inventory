import { useTheme } from '../../../hooks/useTheme';

import Header from '../Header/Header';
import PageContent from '../PageContent/PageContent';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';

const PageLayout = ({ children }) => {
    const { theme } = useTheme();
    return (
        <div className={`${pageStyles.page}`} data-theme={theme}>
            <Header></Header>
            <PageContent>{children}</PageContent>
        </div>
    );
};

export default PageLayout;
