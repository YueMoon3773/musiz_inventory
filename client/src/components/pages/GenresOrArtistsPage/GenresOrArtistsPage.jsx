import { z } from 'zod';

import { useBaseBeUrl } from '../../../hooks/useStorage';
import { useFetchGetData } from '../../../hooks/useFetchData';

import PageLayout from '../../layout/PageLayout/PageLayout';
import ControllerSection from '../../layout/ControllerSection/ControllerSection';
import InventoryItem from '../../base/InventoryItem/InventoryItem';
import LoadingImg from '../../base/LoadingImg/LoadingImg';

import ValidatedComponent from '../../../utils/validateComponentProps';
// import pageStyles from '../../../styles/modules/basePageStyles.module.scss';
import './GenresOrArtistsPage.scss';

const genresOrArtistsPageSchema = z.object({
    pageType: z.string(),
});

const GenresOrArtistsPage = ({ pageType }) => {
    const { baseUrl } = useBaseBeUrl();
    const beUrl = `${baseUrl}/${pageType}`;
    // console.log({ beUrl });

    let { data, error, loading } = useFetchGetData(beUrl);
    // console.log({ data, error, loading });

    return (
        <PageLayout>
            <h2 className="pageTitle">
                {pageType === 'genres' && 'Genres'}
                {pageType === 'artists' && 'Artists'}
            </h2>

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
                            {pageType === 'genres' && <th>Genre</th>}
                            {pageType === 'artists' && <th>Artist</th>}
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.beData.map((item, index) => {
                            return <InventoryItem key={index} inventoryType={pageType} data={item}></InventoryItem>;
                        })}
                    </tbody>
                </table>
            )}
        </PageLayout>
    );
};

export default ValidatedComponent(GenresOrArtistsPage, genresOrArtistsPageSchema);
// export default GenresOrArtistsPage;
