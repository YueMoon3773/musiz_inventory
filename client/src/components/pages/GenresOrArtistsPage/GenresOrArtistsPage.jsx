import { useState } from 'react';
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
    const { data, error, loading, refetch } = useFetchGetData(beUrl);
    // console.log({ beUrl });
    // console.log({ data, error, loading });

    const handleDeleteArtistGenreBtn = async (targetId) => {
        const deleteBeUrl = `${baseUrl}/delete-${pageType.slice(0, -1)}/${targetId}`;
        // console.log([targetId]);
        // console.log({ deleteBeUrl });

        try {
            const res = await fetch(deleteBeUrl, {
                mode: 'cors',
                method: 'DELETE',
            });
            const data = await res.json();

            if (res.ok === false) {
                const message = data.errors.map((e) => e.message).join('\n');
                throw new Error('Delete request failed', { cause: message });
            }
            refetch();
        } catch (err) {
            throw new Error('Failed to delete', { err });
        }
    };

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
                            return (
                                <InventoryItem
                                    key={index}
                                    inventoryType={pageType}
                                    data={item}
                                    editBtnHandler={() => {}}
                                    deleteBtnHandler={handleDeleteArtistGenreBtn}
                                ></InventoryItem>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </PageLayout>
    );
};

export default ValidatedComponent(GenresOrArtistsPage, genresOrArtistsPageSchema);
// export default GenresOrArtistsPage;
