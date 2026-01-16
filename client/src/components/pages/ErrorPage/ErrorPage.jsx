import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';
import PageLayout from '../../layout/PageLayout/PageLayout';

import './ErrorPage.scss';

const errorPageSchema = z.object({
    errorText: z.string().optional(),
});

const ErrorPage = ({ errorText }) => {
    return (
        <>
            <PageLayout>
                {errorText ? (
                    <h2 className="pageTitle">{errorText}</h2>
                ) : (
                    <h2 className="pageTitle">Content not found</h2>
                )}
            </PageLayout>
        </>
    );
};

// export default ErrorPage;
export default ValidatedComponent(ErrorPage, errorPageSchema);
