import { Link, useParams, useNavigate } from 'react-router-dom';

import { useFetchGetData } from '../../../hooks/useFetchData';
import { useBaseBeUrl } from '../../../hooks/useStorage';

import PageLayout from '../../layout/PageLayout/PageLayout';
import EditBtn from '../../base/EditBtn/EditBtn';
import DeleteBtn from '../../base/DeleteBtn/DeleteBtn';
import LoadingImg from '../../base/LoadingImg/LoadingImg';

import './ASongDetailsPage.scss';

const ASongDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { baseUrl } = useBaseBeUrl();
    const beUrl = `${baseUrl}/song-details/${id}`;

    const { data, error, loading } = useFetchGetData(beUrl);
    // console.log({ data, error, loading });

    const handleEditBtnClick = (targetId) => {
        navigate(`${baseUrl}/edit-song/${targetId}`);
    };

    const handleDeleteBtnClick = async (targetId) => {
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

            navigate(`${baseUrl}/songs`);
        } catch (err) {
            throw new Error('Failed to delete', { err });
        }
    };

    return (
        <PageLayout>
            <h2 className="pageTitle">Song details</h2>

            <div className="detailsBody">
                {loading === true && <LoadingImg></LoadingImg>}
                {loading === false && error !== null && data === null && (
                    <p className="errorData">Can not retrieve data, please try again later!</p>
                )}
                {loading === false && error === null && data !== null && (
                    <>
                        <div className="detailsWrapper">
                            <p className="detailTitle">Song name</p>
                            <div className="detailInfo">
                                <p>{data.beData[0].song}</p>
                            </div>
                            <p className="detailTitle">Artist(s)</p>
                            <div className="detailInfo">
                                {data.beData[0].artists.map((item, index) => {
                                    return (
                                        <Link to={`/artist/${data.beData[0].artist_ids[index]}`} key={item}>
                                            {item};
                                        </Link>
                                    );
                                })}
                            </div>
                            <p className="detailTitle">Genre(s)</p>
                            <div className="detailInfo">
                                {data.beData[0].genres.map((item, index) => {
                                    return (
                                        <Link to={`/genre/${data.beData[0].genre_ids[index]}`} key={item}>
                                            {item};
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="detailsController">
                            <EditBtn
                                targetId={data.beData[0].id}
                                isDisabled={!data.beData[0].is_editable}
                                onClickHandler={handleEditBtnClick}
                            ></EditBtn>
                            <DeleteBtn
                                targetId={data.beData[0].id}
                                onClickHandler={handleDeleteBtnClick}
                                isDisabled={!data.beData[0].is_editable}
                            ></DeleteBtn>
                        </div>
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default ASongDetailsPage;
