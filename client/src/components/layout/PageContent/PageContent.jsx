import React from 'react';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';
import './PageContent.scss';

const PageContent = ({ children }) => {
    return <div className={`${pageStyles.pageContent}`}>{children}</div>;
};

export default PageContent;
