import { z } from 'zod';

import { useBaseBeUrl } from '../../../hooks/useStorage';
import { useFetchGetData } from '../../../hooks/useFetchData';
import ValidatedComponent from '../../../utils/validateComponentProps';

import PageLayout from '../../../components/layout/PageLayout/PageLayout';
import ControllerSection from '../../../components/layout/ControllerSection/ControllerSection';
import InventoryItem from '../../../components/base/InventoryItem/InventoryItem';
import LoadingImg from '../../../components/base/LoadingImg/LoadingImg';

// import pageStyles from '../../../styles/modules/basePageStyles.module.scss';
import './SongsPage.scss';

const songPageSchema = z.object({
    pageType: z.string(),
});

const SongsPage = ({ pageType }) => {
    const { baseUrl } = useBaseBeUrl();
    const beUrl = `${baseUrl}/${pageType}`;
    // console.log({ beUrl });

    const { data, error, loading } = useFetchGetData(beUrl);
    // console.log({ data, error, loading });

    return (
        <PageLayout>
            <h2 className="pageTitle">Songs</h2>

            <ControllerSection pageType={pageType}></ControllerSection>

            {loading === true && <LoadingImg></LoadingImg>}
            {loading === false && error !== null && data === null && (
                <p className="errorData">Can not retrieve data, please try again later!</p>
            )}
            {loading === false && error === null && data !== null && (
                <table className="displayTable">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Song title</th>
                            <th>Artist</th>
                            <th>Genre</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.beData.map((item, index) => {
                            return <InventoryItem key={index} inventoryType="songs" data={item}></InventoryItem>;
                        })}
                    </tbody>
                </table>
            )}
        </PageLayout>
    );
};

// export default SongsPage;
export default ValidatedComponent(SongsPage, songPageSchema);
