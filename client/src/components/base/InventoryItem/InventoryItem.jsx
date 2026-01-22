import { Link } from 'react-router-dom';
import { z } from 'zod';

import { useBaseBeUrl } from '../../../hooks/useStorage';

import { MusicTrackIcon, ArtistIcon, GenreIcon } from '../../../assets/svg/svgIcons';
import EditBtn from '../EditBtn/EditBtn';
import DeleteBtn from '../DeleteBtn/DeleteBtn';

import ValidatedComponent from '../../../utils/validateComponentProps';
import './InventoryItem.scss';

const inventoryItemSchema = z.object({
    inventoryType: z.string(),
    data: z.looseObject({}),
    editBtnHandler: z.function(),
    deleteBtnHandler: z.function(),
});

const InventoryItem = ({ inventoryType, data, editBtnHandler, deleteBtnHandler }) => {
    const { baseUrl } = useBaseBeUrl();

    // console.log({ inventoryType });
    // console.log(inventoryType.slice(0, -1));
    // console.log({ data });

    // const handleDeleteArtistGenreBtn = async (targetId) => {
    //     console.log([targetId]);
    //     const beUrl = `${baseUrl}/delete-${inventoryType.slice(0, -1)}/${targetId}`;
    //     console.log({ beUrl });

    //     try {
    //         const res = await fetch(beUrl, {
    //             mode: 'cors',
    //             method: 'DELETE',
    //         });
    //         const data = res.json();

    //         if (res.ok === false) {
    //             const message = data.errors.map((e) => e.message).join('\n');
    //             throw new Error('Delete request failed', { cause: message });
    //         }

    //         navigate(`/${inventoryType}`);
    //     } catch (err) {
    //         throw new Error('Failed to delete', { err });
    //     }
    // };

    // const handleDeleteSongBtn = (targetId) => {};

    return (
        <tr className="inventoryItemRow">
            {inventoryType === 'songs' && (
                <>
                    <td>
                        <div className="trackWrapper">
                            <div className="disc spin">
                                <MusicTrackIcon></MusicTrackIcon>
                            </div>
                        </div>
                    </td>

                    <td>
                        <Link to={`/song-details/${data.id}`}>{data.song}</Link>
                    </td>

                    <td>
                        {Array.isArray(data.artists) ? (
                            <>
                                {data.artists.length <= 0
                                    ? 'N/a'
                                    : data.artists.map((item, index) => {
                                          return (
                                              <Link key={index} to={`/artist-details/${data.artist_ids[index]}`}>
                                                  {item};
                                              </Link>
                                          );
                                      })}
                            </>
                        ) : (
                            <Link to={`/artist-details/${data.artist_ids}`}>{data.artists}</Link>
                        )}
                    </td>

                    <td>
                        {Array.isArray(data.genres) ? (
                            <>
                                {data.genres.length <= 0
                                    ? 'N/a'
                                    : data.genres.map((item, index) => {
                                          return (
                                              <Link key={index} to={`/genre-details/${data.genre_ids[index]}`}>
                                                  {item};
                                              </Link>
                                          );
                                      })}
                            </>
                        ) : (
                            <Link to={`/genre-details/${data.genre_ids}`}>{data.genres}</Link>
                        )}
                    </td>

                    <td>
                        <div className="optBtnsWrapper">
                            <EditBtn isDisabled={!data.is_editable}></EditBtn>
                            <DeleteBtn
                                targetId={data.id}
                                isDisabled={!data.is_editable}
                                onClickHandler={deleteBtnHandler}
                            ></DeleteBtn>
                        </div>
                    </td>
                </>
            )}

            {(inventoryType === 'genres' || inventoryType === 'artists') && (
                <>
                    <td>
                        <div className="trackWrapper">
                            <div className="disc">
                                {inventoryType === 'genres' && <GenreIcon></GenreIcon>}
                                {inventoryType === 'artists' && <ArtistIcon></ArtistIcon>}
                            </div>
                        </div>
                    </td>

                    {inventoryType === 'artists' && (
                        <td>
                            {Array.isArray(data) ? (
                                data.map((item, index) => {
                                    console.log({ item });

                                    return (
                                        <Link key={index} to={`/artist-details/${data.id}`}>
                                            {item};
                                        </Link>
                                    );
                                })
                            ) : (
                                <Link to={`/artist-details/${data.id}`}>{data.artist}</Link>
                            )}
                        </td>
                    )}

                    {inventoryType === 'genres' && (
                        <td>
                            {Array.isArray(data) ? (
                                data.map((item, index) => {
                                    console.log('here');

                                    return (
                                        <Link key={index} to={`/genre-details/${data.id}`}>
                                            {item};
                                        </Link>
                                    );
                                })
                            ) : (
                                <Link to={`/genre-details/${data.id}`}>{data.genre}</Link>
                            )}
                        </td>
                    )}

                    <td>
                        <div className="optBtnsWrapper">
                            <EditBtn isDisabled={!data.is_editable}></EditBtn>
                            <DeleteBtn
                                targetId={data.id}
                                isDisabled={!data.is_editable}
                                onClickHandler={deleteBtnHandler}
                            ></DeleteBtn>
                        </div>
                    </td>
                </>
            )}
        </tr>
    );
};

export default ValidatedComponent(InventoryItem, inventoryItemSchema);
