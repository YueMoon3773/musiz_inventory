import { useParams } from 'react-router-dom';
// import { z } from 'zod';

import { useFetchData } from '../../../hooks/useFetchData';

import PageLayout from '../../layout/PageLayout/PageLayout';
import InventoryItem from '../../base/InventoryItem/InventoryItem';
import LoadingImg from '../../base/LoadingImg/LoadingImg';

// import ValidatedComponent from '../../../utils/validateComponentProps';
import pageStyles from '../../../styles/modules/basePageStyles.module.scss';
import './GenresOrArtistsPage.scss';

// const genresOrArtistsPageSchema = z.object({
//     pageType: z.string(),
// });

const GenresOrArtistsPage = () => {
    const { pageType } = useParams();
    const pageURL = `http://localhost:6600/${pageType}`;
    // console.log({ pageURL });

    const { data, error, loading } = useFetchData(pageURL);
    console.log({ data, error, loading });

    return (
        <PageLayout>
            <h2 className="pageTitle">
                {pageType === 'genres' && 'Genres'}
                {pageType === 'artists' && 'Artists'}
            </h2>

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
                        {/* {pageType === 'genres' &&
                            data.beData.map((item, index) => {
                                return (
                                    <InventoryItem key={index} inventoryType={pageType} data={item}></InventoryItem>
                                );
                            })} */}
                        {/* {pageType === 'artists' &&
                        artists.map((item, index) => {
                            return <InventoryItem key={index} inventoryType="artists" data={item}></InventoryItem>;
                        })} */}
                        {data.beData.map((item, index) => {
                            return <InventoryItem key={index} inventoryType={pageType} data={item}></InventoryItem>;
                        })}
                    </tbody>
                </table>
            )}
        </PageLayout>
    );
};

// export default ValidatedComponent(GenresOrArtistsPage, genresOrArtistsPageSchema);
export default GenresOrArtistsPage;
