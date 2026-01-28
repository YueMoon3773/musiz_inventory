import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { useBaseBeUrl } from '../../../hooks/useStorage';
import { useFetchGetData } from '../../../hooks/useFetchData';
import ValidatedComponent from '../../../utils/validateComponentProps';

import PageLayout from '../../../components/layout/PageLayout/PageLayout';
import ControllerSection from '../../../components/layout/ControllerSection/ControllerSection';
import InventoryItem from '../../../components/base/InventoryItem/InventoryItem';
import LoadingImg from '../../../components/base/LoadingImg/LoadingImg';

const songsByGenreOrArtistDetailsPageSchema = z.object({
    target: z.string(),
});

const SongsByGenreOrArtistDetailsPage = ({ target }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { baseUrl } = useBaseBeUrl();
    const beUrl = `${baseUrl}/${target}-details/${id}`;

    const { data, error, loading, refetch, newFetchUrl } = useFetchGetData(beUrl);

    console.log({ beUrl, id });
    console.log({ data, error, loading });

    const handleDeleteSongBtn = async (targetId) => {
        const deleteUrl = `${baseUrl}/delete-song/${targetId}`;

        try {
            const res = await fetch(deleteUrl, {
                mode: 'cors',
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok == false) {
                const message = data.errors.map((e) => e.message).join('\n');
                throw new Error('Delete request failed', { cause: message });
            }

            refetch();
        } catch (err) {
            throw new Error('Failed to delete', { cause: err });
        }
    };

    const handleEditSongBtn = (targetId) => {
        navigate(`${baseUrl}/edit-song/${targetId}`);
    };

    return (
        <PageLayout>
            <h2 className="pageTitle">{`Songs by ${target}`}</h2>

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
                            return (
                                <InventoryItem
                                    key={index}
                                    inventoryType="songs"
                                    data={item}
                                    editBtnHandler={handleEditSongBtn}
                                    deleteBtnHandler={handleDeleteSongBtn}
                                ></InventoryItem>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </PageLayout>
    );
};

export default ValidatedComponent(SongsByGenreOrArtistDetailsPage, songsByGenreOrArtistDetailsPageSchema);
