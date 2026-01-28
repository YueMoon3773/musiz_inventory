import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useBaseBeUrl } from '../../../hooks/useStorage';
import { useFetchGetData } from '../../../hooks/useFetchData';

import PageLayout from '../../layout/PageLayout/PageLayout';
import ControllerSection from '../../layout/ControllerSection/ControllerSection';
import InventoryItem from '../../base/InventoryItem/InventoryItem';
import LoadingImg from '../../base/LoadingImg/LoadingImg';

import ValidatedComponent from '../../../utils/validateComponentProps';
import './GenresOrArtistsPage.scss';

const genresOrArtistsPageSchema = z.object({
    pageType: z.string(),
});

const GenresOrArtistsPage = ({ pageType }) => {
    const navigate = useNavigate();
    const { baseUrl } = useBaseBeUrl();
    const beUrl = `${baseUrl}/${pageType}`;

    const [sortOrderValue, setSortOrderValue] = useState(null);
    const { data, error, loading, refetch, newFetchUrl } = useFetchGetData(beUrl);
    // console.log({ beUrl });
    // console.log({ data, error, loading });
    // console.log({ sortOrderValue });

    useEffect(() => {
        // if ( sortOrderValue === null) return;

        const sortUrl = `${beUrl}?orderDirection=${sortOrderValue}`;
        // console.log({ sortUrl });

        newFetchUrl(sortUrl);
    }, [sortOrderValue]);

    const handleDeleteGenreArtistBtn = async (targetId) => {
        const deleteBeUrl = `${baseUrl}/delete-${pageType.slice(0, -1)}/${targetId}`;
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
            throw new Error('Failed to delete', { cause: err });
        }
    };

    const handleEditGenreArtistBtn = async (targetId) => {
        const editBtnUrl = `${baseUrl}/edit-${pageType.slice(0, -1)}/${targetId}`;
        // console.log({ editBtnUrl });
        navigate(editBtnUrl);
    };

    const handleSortOrderChange = async (value) => {
        setSortOrderValue(value);
    };

    return (
        <PageLayout>
            <h2 className="pageTitle">
                {pageType === 'genres' && 'Genres'}
                {pageType === 'artists' && 'Artists'}
            </h2>

            <ControllerSection pageType={pageType} sortOrderOnChangeHandler={handleSortOrderChange}></ControllerSection>

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
                                    editBtnHandler={handleEditGenreArtistBtn}
                                    deleteBtnHandler={handleDeleteGenreArtistBtn}
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
