import { Link } from 'react-router-dom';
import { z } from 'zod';

import { MusicTrackIcon, ArtistIcon, GenreIcon } from '../../../assets/svg/svgIcons';
import EditBtn from '../EditBtn/EditBtn';
import DeleteBtn from '../DeleteBtn/DeleteBtn';

import ValidatedComponent from '../../../utils/validateComponentProps';
import './InventoryItem.scss';

const inventoryItemSchema = z.object({
    inventoryType: z.string(),
    data: z.looseObject({}),
});

const InventoryItem = ({ inventoryType, data }) => {
    // console.log({ inventoryType });
    // console.log({ data });

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
                        {Array.isArray(data.artist) ? (
                            data.artist.map((item, index) => {
                                return (
                                    <Link key={index} to={`/artist/${data.artist_id}`}>
                                        {item};
                                    </Link>
                                );
                            })
                        ) : (
                            <Link to={`/artist/${data.artist_id}`}>{data.artist}</Link>
                        )}
                    </td>

                    <td>
                        {Array.isArray(data.genre) ? (
                            data.genre.map((item, index) => {
                                return (
                                    <Link key={index} to={`/genre/${data.genre_id}`}>
                                        {item};
                                    </Link>
                                );
                            })
                        ) : (
                            <Link to={`/genre/${data.genre_id}`}>{data.genre}</Link>
                        )}
                    </td>

                    <td>
                        <div className="optBtnsWrapper">
                            <EditBtn></EditBtn>
                            <DeleteBtn></DeleteBtn>
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
                                        <Link key={index} to={`/artist/${data.id}`}>
                                            {item};
                                        </Link>
                                    );
                                })
                            ) : (
                                <Link to={`/artist/${data.id}`}>{data.artist}</Link>
                            )}
                        </td>
                    )}

                    {inventoryType === 'genres' && (
                        <td>
                            {Array.isArray(data) ? (
                                data.map((item, index) => {
                                    console.log('here');

                                    return (
                                        <Link key={index} to={`/genre/${data.id}`}>
                                            {item};
                                        </Link>
                                    );
                                })
                            ) : (
                                // <>
                                //     <p>here</p>
                                // </>
                                <Link to={`/genre/${data.id}`}>{data.genre}</Link>
                            )}
                        </td>
                    )}

                    <td>
                        <div className="optBtnsWrapper">
                            <EditBtn></EditBtn>
                            <DeleteBtn></DeleteBtn>
                        </div>
                    </td>
                </>
            )}
        </tr>
    );
};

export default ValidatedComponent(InventoryItem, inventoryItemSchema);
