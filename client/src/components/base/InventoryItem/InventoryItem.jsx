import { Link } from 'react-router-dom';
import { z } from 'zod';

import { MusicTrackIcon } from '../../../assets/svg/svgIcons';
import EditBtn from '../EditBtn/EditBtn';
import DeleteBtn from '../DeleteBtn/DeleteBtn';

import ValidatedComponent from '../../../utils/validateComponentProps';
import './InventoryItem.scss';

const inventoryItemSchema = z.object({
    data: z.looseObject({}),
});

const InventoryItem = ({ data }) => {
    // console.log(data);

    return (
        <tr className="inventoryItemRow">
            <td>
                <div className="trackWrapper">
                    <div className="disc">
                        <MusicTrackIcon></MusicTrackIcon>
                    </div>
                </div>
            </td>

            <td>
                <Link to={`/song-details/${data.id}`}>{data.song}</Link>
            </td>

            <td>
                {Array.isArray(data.artist) ? (
                    data.artist.map((item, key) => {
                        return (
                            <Link key={key} to={`/artist/${data.artist_id}`}>
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
        </tr>
    );
};

export default ValidatedComponent(InventoryItem, inventoryItemSchema);
