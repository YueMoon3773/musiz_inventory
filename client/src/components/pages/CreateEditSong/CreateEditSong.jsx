import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const filterToGetUniqueArray = (arr) => {
    const seen = new Set();

    const uniqueArray = arr.filter((item) => {
        if (seen.has(item.value)) return false;
        seen.add(item.value);
        return true;
    });

    return uniqueArray;
};

const CreateEditSong = ({ pageType, target }) => {
    const navigate = useNavigate();

    const inpLabel = (text) => String(text).charAt(0).toUpperCase() + String(text).slice(1);
    const { baseUrl } = useBaseBeUrl();
    const beUrl = `${baseUrl}/${pageType}-${target}`;
    const artistsUrl = `${baseUrl}/artists`;
    const genresUrl = `${baseUrl}/genres`;

    const [inpValue, setInpValue] = useState('');
    const [inpError, setInpError] = useState(null);
    const [isInpInteracted, setIsInpInteracted] = useState(false);

    const [defaultArtistSelectionValue, setDefaultArtistSelectionValue] = useState('');
    const [artistSelectionValue, setArtistSelectionValue] = useState([]);

    const [defaultGenreSelectionValue, setDefaultGenreSelectionValue] = useState('');
    const [genreSelectionValue, setGenreSelectionValue] = useState([]);

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

    const formInpSchema = z
        .string()
        .min(2, `${inpLabel(target)} name must be at least 2 characters.`)
        .max(30, `${inpLabel(target)} name must be shorter than 30 characters.`)
        .regex(
            /^[a-zA-Z0-9_!@#$%^&*()\-\+= ]+$/,
            'Only letters, numbers, underscores, parentheses and mathematical/logical operators allowed',
        );

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
        setArtistSelectionValue((prev) => [...prev, { id: nextArtistId, value: defaultArtistSelectionValue }]);
    };

    const handleArtistSelectionOnChange = (id, selectionValue) => {
        setArtistSelectionValue((prev) => {
            return prev.map((item) => {
                if (item.id !== Number(id)) return item;
                return { id: Number(id), value: selectionValue };
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
        setGenreSelectionValue((prev) => [...prev, { id: nextGenreId, value: defaultGenreSelectionValue }]);
    };

    const handleGenreSelectionOnChange = (id, selectionValue) => {
        setGenreSelectionValue((prev) => {
            return prev.map((item) => {
                if (item.id !== Number(id)) return item;
                return { id: Number(id), value: selectionValue };
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

    const handleSubmitBtn = async (e) => {
        e.preventDefault();
        console.log({ inpValue, genreSelectionValue, artistSelectionValue });
        const artistValues = filterToGetUniqueArray(artistSelectionValue);
        const genreValues = filterToGetUniqueArray(genreSelectionValue);
        console.log(
            JSON.stringify({
                song: inpValue.toLowerCase(),
                genre: genreValues,
                artist: artistValues,
            }),
        );

        if (inpError !== null) return;

        const res = await fetch(beUrl, {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                song: inpValue.toLowerCase(),
                genre: genreValues,
                artist: artistValues,
            }),
        });

        const data = res.json();

        if (res.ok === false) {
            throw new Error(data.errors?.[0]?.msg || 'Request failed');
        }

        // console.log({ res });

        // navigate(`/${target}s`);
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
                        {artistsLoading === true && genresLoading === true && (
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

// export default CreateEditSong;
export default ValidatedComponent(CreateEditSong, createEditSongSchema);
