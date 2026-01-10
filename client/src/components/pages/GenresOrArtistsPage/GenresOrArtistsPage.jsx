import { z } from 'zod';

import PageLayout from '../../layout/PageLayout/PageLayout';
import InventoryItem from '../../base/InventoryItem/InventoryItem';

import { genres, artists } from '../../../db/db';

import ValidatedComponent from '../../../utils/validateComponentProps';
import pageStyles from '../../../styles/modules/basePageStyles.module.scss';
import './GenresOrArtistsPage.scss';

const genresOrArtistsPageSchema = z.object({
    pageType: z.string(),
});

const GenresOrArtistsPage = ({ pageType }) => {
    return (
        <PageLayout>
            <h2 className="pageTitle">
                {pageType === 'genres' && 'Genres'}
                {pageType === 'artists' && 'Artists'}
            </h2>

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
                    {pageType === 'genres' &&
                        genres.map((item, index) => {
                            return <InventoryItem key={index} inventoryType="genres" data={item}></InventoryItem>;
                        })}
                    {pageType === 'artists' &&
                        artists.map((item, index) => {
                            return <InventoryItem key={index} inventoryType="artists" data={item}></InventoryItem>;
                        })}
                </tbody>
            </table>
        </PageLayout>
    );
};

export default ValidatedComponent(GenresOrArtistsPage, genresOrArtistsPageSchema);
