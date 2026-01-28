import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { useFetchGetData } from '../../../hooks/useFetchData';
import { useBaseBeUrl } from '../../../hooks/useStorage';
import ValidatedComponent from '../../../utils/validateComponentProps';

import ErrorPage from '../ErrorPage/ErrorPage';
import CreateEditPageLayout from '../../layout/CreateEditPageLayout/CreateEditPageLayout';
import LoadingImg from '../../base/LoadingImg/LoadingImg';
import Selection from '../../base/Selection/Selection';
import DeleteBtn from '../../base/DeleteBtn/DeleteBtn';

import './CreateEditSong.scss';

const createEditSongSchema = z.object({
    pageType: z.string(),
    target: z.string(),
});

const filterToGetUniqueArray = (pageType, type, arr) => {
    const seen = new Set();

    const filteredArray = arr.filter((item) => {
        if (seen.has(item.value)) return false;
        seen.add(item.value);
        return true;
    });

    let uniqueArray;

    if (pageType === 'create') {
        uniqueArray = filteredArray.map((item) => item.value);
    } else if (pageType === 'edit' && type === 'artist') {
        uniqueArray = filteredArray.map((item) => {
            return { artist_id: item.artist_id, value: item.value };
        });
    } else if (pageType === 'edit' && type === 'genre') {
        uniqueArray = filteredArray.map((item) => {
            return { genre_id: item.genre_id, value: item.value };
        });
    }

    return uniqueArray;
};

const CreateSong = ({
    pageType,
    target,
    beUrl,
    artistsUrl,
    genresUrl,
    formInpSchema,
    inpValue,
    inpError,
    setInpError,
    isInpInteracted,
    setIsInpInteracted,
    setDefaultArtistSelectionValue,
    artistSelectionValue,
    setArtistSelectionValue,
    setDefaultGenreSelectionValue,
    genreSelectionValue,
    setGenreSelectionValue,
    handleChangeSongTitle,
    handleOnBlurInp,
    handleAddArtistBtn,
    handleArtistSelectionOnChange,
    handleDeleteArtistBtn,
    handleAddGenreBtn,
    handleGenreSelectionOnChange,
    handleDeleteGenreBtn,
}) => {
    const navigate = useNavigate();

    const { data: artistsData, error: artistsError, loading: artistsLoading } = useFetchGetData(artistsUrl);
    const { data: genresData, error: genresError, loading: genresLoading } = useFetchGetData(genresUrl);
    // console.log({ artistsData });
    // console.log({ genresData });

    useEffect(() => {
        if (artistsData === null || genresData === null) {
            return;
        }

        const defaultArtistValue = artistsData.beData[0].artist;
        const defaultGenreValue = genresData.beData[0].genre;

        setDefaultArtistSelectionValue(defaultArtistValue);
        setDefaultGenreSelectionValue(defaultGenreValue);

        setArtistSelectionValue([{ id: 1, value: defaultArtistValue }]);
        setGenreSelectionValue([{ id: 1, value: defaultGenreValue }]);
    }, [artistsData, genresData]);

    const handleSubmitBtn = async (e) => {
        e.preventDefault();
        // console.log({ inpValue, genreSelectionValue, artistSelectionValue });

        try {
            const artistValues = filterToGetUniqueArray(pageType, 'artist', artistSelectionValue);
            const genreValues = filterToGetUniqueArray(pageType, 'genre', genreSelectionValue);
            // console.log({ inpValue, artistValues, genreValues });

            const result = formInpSchema.safeParse(inpValue);
            setInpError(result.success ? null : result.error.issues[0].message);
            setIsInpInteracted(true);

            if (!result.success || inpError !== null) {
                throw new Error('Input value is invalid', { cause: result.error.issues[0].message });
            }

            const res = await fetch(beUrl, {
                mode: 'cors',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    song: inpValue.toLowerCase(),
                    genres: genreValues,
                    artists: artistValues,
                }),
            });

            const data = await res.json();
            // console.log(data.errors);

            if (res.ok === false) {
                const messages = data.errors
                    .map((e) => {
                        return `${e.type}: ${e.msg}
                In ${e.location}: ${e.path}
                Received value: ${e.value}
                `;
                    })
                    .join('\n');
                throw new Error('Failure msg:', { cause: messages });
            }
            navigate(`/${target}s`);
        } catch (err) {
            throw new Error('Request failed', { cause: err });
        }
    };

    return (
        <>
            {artistsLoading === false &&
            genresLoading === false &&
            artistsError !== null &&
            genresError !== null &&
            artistsData === null &&
            genresData === null ? (
                <ErrorPage errorText="Can not retrieve data, please try again later!"></ErrorPage>
            ) : (
                <CreateEditPageLayout
                    pageType={pageType}
                    target={target}
                    inpValue={inpValue}
                    handleAddArtistBtn={handleAddArtistBtn}
                    handleAddGenreBtn={handleAddGenreBtn}
                    handleChangeInpValue={handleChangeSongTitle}
                    handleOnBlurInp={handleOnBlurInp}
                    inpError={inpError}
                    isInpInteracted={isInpInteracted}
                    handleSubmitBtn={handleSubmitBtn}
                >
                    <>
                        {(artistsLoading === true || genresLoading === true) && (
                            <div className="loadingWrapper">
                                <LoadingImg></LoadingImg>
                            </div>
                        )}
                        {artistsLoading === false && artistsError === null && artistsData !== null && (
                            <>
                                {artistSelectionValue.length === 1 && (
                                    <Selection
                                        selectionLabel={'Artist'}
                                        selectionId={`artists_${artistSelectionValue[0].id}`}
                                        selectionValue={artistSelectionValue[0].value}
                                        selectionType={'artists'}
                                        selectionOptsList={artistsData.beData}
                                        selectionOnChangeHandle={handleArtistSelectionOnChange}
                                    ></Selection>
                                )}
                                {artistSelectionValue.length > 1 && (
                                    <div className="selectionsWrapper">
                                        {artistSelectionValue.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <Selection
                                                        selectionLabel={`Artist`}
                                                        selectionId={`artists_${item.id}`}
                                                        selectionValue={item.value}
                                                        selectionType={'artists'}
                                                        selectionOptsList={artistsData.beData}
                                                        selectionOnChangeHandle={handleArtistSelectionOnChange}
                                                    ></Selection>
                                                    <DeleteBtn
                                                        targetId={item.id}
                                                        onClickHandler={handleDeleteArtistBtn}
                                                    ></DeleteBtn>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                        {genresLoading === false && genresError === null && genresData !== null && (
                            <>
                                {genreSelectionValue.length === 1 && (
                                    <Selection
                                        selectionLabel={'Genre'}
                                        selectionId={`genres_${genreSelectionValue[0].id}`}
                                        selectionValue={genreSelectionValue[0].value}
                                        selectionType={'genres'}
                                        selectionOptsList={genresData.beData}
                                        selectionOnChangeHandle={handleGenreSelectionOnChange}
                                    ></Selection>
                                )}
                                {genreSelectionValue.length > 1 && (
                                    <div className="selectionsWrapper">
                                        {genreSelectionValue.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <Selection
                                                        selectionLabel={`Genre`}
                                                        selectionId={`genres_${item.id}`}
                                                        selectionValue={item.value}
                                                        selectionType={'genres'}
                                                        selectionOptsList={genresData.beData}
                                                        selectionOnChangeHandle={handleGenreSelectionOnChange}
                                                    ></Selection>
                                                    <DeleteBtn
                                                        targetId={item.id}
                                                        onClickHandler={handleDeleteGenreBtn}
                                                    ></DeleteBtn>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                </CreateEditPageLayout>
            )}
        </>
    );
};

const EditSong = ({
    pageType,
    target,
    targetId,
    baseUrl,
    beUrl,
    artistsUrl,
    genresUrl,
    formInpSchema,
    inpValue,
    setInpValue,
    inpError,
    setInpError,
    isInpInteracted,
    setIsInpInteracted,
    setDefaultArtistSelectionValue,
    artistSelectionValue,
    setArtistSelectionValue,
    setDefaultGenreSelectionValue,
    genreSelectionValue,
    setGenreSelectionValue,
    handleChangeSongTitle,
    handleOnBlurInp,
    handleAddArtistBtn,
    handleArtistSelectionOnChange,
    handleDeleteArtistBtn,
    handleAddGenreBtn,
    handleGenreSelectionOnChange,
    handleDeleteGenreBtn,
}) => {
    const navigate = useNavigate();
    const originalBeUrl = `${beUrl}/${targetId}`;
    // console.log({ targetId });
    // console.log({ originalBeUrl });

    const [originalSongId, setOriginalSongId] = useState(null);
    const [originalArtistIds, setOriginalArtistIds] = useState(null);
    const [originalGenreIds, setOriginalGenreIds] = useState(null);

    const { data: originalData, error: originalError, loading: originalLoading } = useFetchGetData(originalBeUrl);
    const { data: artistsData, error: artistsError, loading: artistsLoading } = useFetchGetData(artistsUrl);
    const { data: genresData, error: genresError, loading: genresLoading } = useFetchGetData(genresUrl);

    // console.log('BEFORE:');
    // console.log({ originalData, originalError, originalLoading });
    // console.log({ artistsData, artistsError, artistsLoading });
    // console.log({ genresData, genresError, genresLoading });

    useEffect(() => {
        if (artistsData === null || genresData === null || originalData === null) {
            return;
        }

        const defaultArtistValue = artistsData.beData[0].artist;
        const defaultGenreValue = genresData.beData[0].genre;

        const originalArtistValues = originalData.beData[0].artists.map((item, index) => {
            return { id: index + 1, artist_id: originalData.beData[0].artist_ids[index], value: item };
        });
        const originalGenreValues = originalData.beData[0].genres.map((item, index) => {
            return { id: index + 1, genre_id: originalData.beData[0].genre_ids[index], value: item };
        });

        // console.log({ originalArtistValues, originalGenreValues });

        setDefaultArtistSelectionValue(defaultArtistValue);
        setDefaultGenreSelectionValue(defaultGenreValue);

        setOriginalSongId(originalData.beData[0].id);
        setOriginalArtistIds(originalData.beData[0].artist_ids);
        setOriginalGenreIds(originalData.beData[0].genre_ids);

        setInpValue(originalData.beData[0].song);
        setArtistSelectionValue(originalArtistValues);
        setGenreSelectionValue(originalGenreValues);
    }, [artistsData, genresData, originalData]);

    const handleSubmitBtn = async () => {
        // console.log({ originalSongId, inpValue, genreSelectionValue, artistSelectionValue });

        try {
            const artistValues = filterToGetUniqueArray(pageType, 'artist', artistSelectionValue);
            const genreValues = filterToGetUniqueArray(pageType, 'genre', genreSelectionValue);
            console.log({ originalSongId, inpValue, artistValues, genreValues, originalGenreIds, originalArtistIds });

            const result = formInpSchema.safeParse(inpValue);
            setInpError(result.success ? null : result.error.issues[0].message);
            setIsInpInteracted(true);

            if (!result.success || inpError !== null) {
                throw new Error('Input value is invalid', { cause: result.error.issues[0].message });
            }

            const res = await fetch(originalBeUrl, {
                mode: 'cors',
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    songId: Number(targetId),
                    song: inpValue.toLowerCase(),
                    genres: genreValues,
                    artists: artistValues,
                    originalGenreIds: originalGenreIds,
                    originalArtistIds: originalArtistIds,
                }),
            });

            const data = await res.json();
            // console.log(data.errors);

            if (res.ok === false) {
                const messages = data.errors
                    .map((e) => {
                        return `${e.type}: ${e.msg}
                In ${e.location}: ${e.path}
                Received value: ${e.value}
                `;
                    })
                    .join('\n');
                throw new Error('Failure msg:', { cause: messages });
            }
            navigate(`/${target}s`);
        } catch (err) {
            throw new Error('Request failed', { cause: err });
        }
    };

    const handleDeleteBtn = async (targetId) => {
        const deleteUrl = `${baseUrl}/delete-${target}/${targetId}`;

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

            navigate(`/${target}s`);
        } catch (err) {
            throw new Error('Failed to delete', { cause: err });
        }
    };

    return (
        <>
            {originalLoading === false &&
            artistsLoading === false &&
            genresLoading === false &&
            originalError !== null &&
            artistsError !== null &&
            genresError !== null &&
            originalData === null &&
            artistsData === null &&
            genresData === null ? (
                <ErrorPage errorText="Can not retrieve data, please try again later!"></ErrorPage>
            ) : (
                <CreateEditPageLayout
                    pageType={pageType}
                    target={target}
                    targetId={targetId}
                    targetIsEditable={true}
                    inpValue={inpValue}
                    handleAddArtistBtn={handleAddArtistBtn}
                    handleAddGenreBtn={handleAddGenreBtn}
                    handleChangeInpValue={handleChangeSongTitle}
                    handleOnBlurInp={handleOnBlurInp}
                    inpError={inpError}
                    isInpInteracted={isInpInteracted}
                    handleSubmitBtn={handleSubmitBtn}
                    handleDeleteBtn={handleDeleteBtn}
                >
                    <>
                        {(originalLoading === true || artistsLoading === true || genresLoading === true) && (
                            <div className="loadingWrapper">
                                <LoadingImg></LoadingImg>
                            </div>
                        )}
                        {originalLoading === false &&
                            originalData !== null &&
                            originalError === null &&
                            artistsLoading === false &&
                            artistsError === null &&
                            artistsData !== null && (
                                <>
                                    {artistSelectionValue.length === 1 && (
                                        <Selection
                                            selectionLabel={'Artist'}
                                            selectionId={`artists_${artistSelectionValue[0].id}`}
                                            selectionValue={artistSelectionValue[0].value}
                                            selectionType={'artists'}
                                            selectionOptsList={artistsData.beData}
                                            selectionOnChangeHandle={handleArtistSelectionOnChange}
                                        ></Selection>
                                    )}
                                    {artistSelectionValue.length > 1 && (
                                        <div className="selectionsWrapper">
                                            {artistSelectionValue.map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <Selection
                                                            selectionLabel={`Artist`}
                                                            selectionId={`artists_${item.id}`}
                                                            selectionValue={item.value}
                                                            selectionType={'artists'}
                                                            selectionOptsList={artistsData.beData}
                                                            selectionOnChangeHandle={handleArtistSelectionOnChange}
                                                        ></Selection>
                                                        <DeleteBtn
                                                            targetId={item.id}
                                                            onClickHandler={handleDeleteArtistBtn}
                                                        ></DeleteBtn>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        {originalLoading === false &&
                            originalData !== null &&
                            originalError === null &&
                            genresLoading === false &&
                            genresError === null &&
                            genresData !== null && (
                                <>
                                    {genreSelectionValue.length === 1 && (
                                        <Selection
                                            selectionLabel={'Genre'}
                                            selectionId={`genres_${genreSelectionValue[0].id}`}
                                            selectionValue={genreSelectionValue[0].value}
                                            selectionType={'genres'}
                                            selectionOptsList={genresData.beData}
                                            selectionOnChangeHandle={handleGenreSelectionOnChange}
                                        ></Selection>
                                    )}
                                    {genreSelectionValue.length > 1 && (
                                        <div className="selectionsWrapper">
                                            {genreSelectionValue.map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <Selection
                                                            selectionLabel={`Genre`}
                                                            selectionId={`genres_${item.id}`}
                                                            selectionValue={item.value}
                                                            selectionType={'genres'}
                                                            selectionOptsList={genresData.beData}
                                                            selectionOnChangeHandle={handleGenreSelectionOnChange}
                                                        ></Selection>
                                                        <DeleteBtn
                                                            targetId={item.id}
                                                            onClickHandler={handleDeleteGenreBtn}
                                                        ></DeleteBtn>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                    </>
                </CreateEditPageLayout>
            )}
        </>
    );

    // return <h1>hello</h1>;
};

const CreateEditSong = ({ pageType, target }) => {
    const { id } = useParams();
    const { baseUrl } = useBaseBeUrl();
    const beUrl = `${baseUrl}/${pageType}-${target}`;
    const artistsUrl = `${baseUrl}/artists`;
    const genresUrl = `${baseUrl}/genres`;

    const inpLabel = (text) => String(text).charAt(0).toUpperCase() + String(text).slice(1);
    const formInpSchema = z
        .string()
        .min(2, `${inpLabel(target)} name must be at least 2 characters.`)
        .max(30, `${inpLabel(target)} name must be shorter than 30 characters.`)
        .regex(
            /^[a-zA-Z0-9_!@#$%^&*()\-\+= ]+$/,
            'Only letters, numbers, underscores, parentheses and mathematical/logical operators allowed',
        );

    const [inpValue, setInpValue] = useState('');
    const [inpError, setInpError] = useState(null);
    const [isInpInteracted, setIsInpInteracted] = useState(false);

    const [defaultArtistSelectionValue, setDefaultArtistSelectionValue] = useState('');
    const [artistSelectionValue, setArtistSelectionValue] = useState([]);

    const [defaultGenreSelectionValue, setDefaultGenreSelectionValue] = useState('');
    const [genreSelectionValue, setGenreSelectionValue] = useState([]);

    const handleChangeSongTitle = (inpValue) => {
        // console.log({ inpValue });
        setInpValue(inpValue);

        const result = formInpSchema.safeParse(inpValue);
        // console.log(result);

        setInpError(result.success ? null : result.error.issues[0].message);
    };

    const handleOnBlurInp = () => {
        setIsInpInteracted(true);
    };

    const handleAddArtistBtn = () => {
        const nextArtistId = artistSelectionValue[artistSelectionValue.length - 1].id + 1;
        if (pageType === 'create')
            setArtistSelectionValue((prev) => [...prev, { id: nextArtistId, value: defaultArtistSelectionValue }]);
        else if (pageType === 'edit')
            setArtistSelectionValue((prev) => [
                ...prev,
                { id: nextArtistId, artist_id: null, value: defaultArtistSelectionValue },
            ]);
    };

    const handleArtistSelectionOnChange = (id, selectionValue) => {
        if (pageType === 'create')
            setArtistSelectionValue((prev) => {
                return prev.map((item) => {
                    if (item.id !== Number(id)) return item;
                    return { id: Number(id), value: selectionValue };
                });
            });
        else if (pageType === 'edit')
            setArtistSelectionValue((prev) => {
                return prev.map((item) => {
                    if (item.id !== Number(id)) return item;
                    return { id: Number(id), artist_id: item.artist_id, value: selectionValue };
                });
            });
    };

    const handleDeleteArtistBtn = (id) => {
        setArtistSelectionValue((prev) => {
            return prev.filter((item) => {
                if (item.id !== Number(id)) return true;
                return false;
            });
        });
    };

    const handleAddGenreBtn = () => {
        const nextGenreId = genreSelectionValue[genreSelectionValue.length - 1].id + 1;
        if (pageType === 'create')
            setGenreSelectionValue((prev) => [...prev, { id: nextGenreId, value: defaultGenreSelectionValue }]);
        else if (pageType === 'edit')
            setGenreSelectionValue((prev) => [
                ...prev,
                { id: nextGenreId, genre_id: null, value: defaultGenreSelectionValue },
            ]);
    };

    const handleGenreSelectionOnChange = (id, selectionValue) => {
        if (pageType === 'create')
            setGenreSelectionValue((prev) => {
                return prev.map((item) => {
                    if (item.id !== Number(id)) return item;
                    return { id: Number(id), value: selectionValue };
                });
            });
        else if (pageType === 'edit')
            setGenreSelectionValue((prev) => {
                return prev.map((item) => {
                    if (item.id !== Number(id)) return item;
                    return { id: Number(id), genre_id: item.genre_id, value: selectionValue };
                });
            });
    };

    const handleDeleteGenreBtn = (id) => {
        setGenreSelectionValue((prev) => {
            return prev.filter((item) => {
                if (item.id !== Number(id)) return true;
                return false;
            });
        });
    };

    if (pageType === 'create') {
        return (
            <CreateSong
                pageType={pageType}
                target={target}
                beUrl={beUrl}
                artistsUrl={artistsUrl}
                genresUrl={genresUrl}
                formInpSchema={formInpSchema}
                inpValue={inpValue}
                inpError={inpError}
                setInpError={setInpError}
                isInpInteracted={isInpInteracted}
                setIsInpInteracted={setIsInpInteracted}
                setDefaultArtistSelectionValue={setDefaultArtistSelectionValue}
                artistSelectionValue={artistSelectionValue}
                setArtistSelectionValue={setArtistSelectionValue}
                setDefaultGenreSelectionValue={setDefaultGenreSelectionValue}
                genreSelectionValue={genreSelectionValue}
                setGenreSelectionValue={setGenreSelectionValue}
                handleChangeSongTitle={handleChangeSongTitle}
                handleOnBlurInp={handleOnBlurInp}
                handleAddArtistBtn={handleAddArtistBtn}
                handleArtistSelectionOnChange={handleArtistSelectionOnChange}
                handleDeleteArtistBtn={handleDeleteArtistBtn}
                handleAddGenreBtn={handleAddGenreBtn}
                handleGenreSelectionOnChange={handleGenreSelectionOnChange}
                handleDeleteGenreBtn={handleDeleteGenreBtn}
            ></CreateSong>
        );
    } else if (pageType === 'edit') {
        return (
            <EditSong
                pageType={pageType}
                target={target}
                targetId={Number(id)}
                baseUrl={baseUrl}
                beUrl={beUrl}
                artistsUrl={artistsUrl}
                genresUrl={genresUrl}
                formInpSchema={formInpSchema}
                inpValue={inpValue}
                setInpValue={setInpValue}
                inpError={inpError}
                setInpError={setInpError}
                isInpInteracted={isInpInteracted}
                setIsInpInteracted={setIsInpInteracted}
                setDefaultArtistSelectionValue={setDefaultArtistSelectionValue}
                artistSelectionValue={artistSelectionValue}
                setArtistSelectionValue={setArtistSelectionValue}
                setDefaultGenreSelectionValue={setDefaultGenreSelectionValue}
                genreSelectionValue={genreSelectionValue}
                setGenreSelectionValue={setGenreSelectionValue}
                handleChangeSongTitle={handleChangeSongTitle}
                handleOnBlurInp={handleOnBlurInp}
                handleAddArtistBtn={handleAddArtistBtn}
                handleArtistSelectionOnChange={handleArtistSelectionOnChange}
                handleDeleteArtistBtn={handleDeleteArtistBtn}
                handleAddGenreBtn={handleAddGenreBtn}
                handleGenreSelectionOnChange={handleGenreSelectionOnChange}
                handleDeleteGenreBtn={handleDeleteGenreBtn}
            ></EditSong>
        );
    }
};

export default ValidatedComponent(CreateEditSong, createEditSongSchema);
