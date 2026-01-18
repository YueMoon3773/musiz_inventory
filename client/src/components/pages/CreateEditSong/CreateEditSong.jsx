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

const CreateEditSong = ({ pageType, target }) => {
    const navigate = useNavigate();
    // const { numberArtistSelection, increaseArtistNumberSelection, decreaseArtistNumberSelection } =
    //     useArtistNumberSelection();
    // const { numberGenreSelection, increaseGenreNumberSelection, decreaseGenreNumberSelection } =
    //     useGenreNumberSelection();

    const inpLabel = (text) => String(text).charAt(0).toUpperCase() + String(text).slice(1);
    const { baseUrl } = useBaseBeUrl();
    const beUrl = `${baseUrl}/${pageType}-${target}`;
    const artistsUrl = `${baseUrl}/artists`;
    const genresUrl = `${baseUrl}/genres`;

    const [inpValue, setInpValue] = useState('');
    const [inpError, setInpError] = useState(null);
    const [isInpInteracted, setIsInpInteracted] = useState(false);

    const [numberArtistSelection, setNumberArtistSelection] = useState(1);
    const [numberGenreSelection, setNumberGenreSelection] = useState(1);
    const [artistSelectionValue, setArtistSelectionValue] = useState(null);
    const [genreSelectionValue, setGenreSelectionValue] = useState(null);

    const { data: artistsData, error: artistsError, loading: artistsLoading } = useFetchGetData(artistsUrl);
    const { data: genresData, error: genresError, loading: genresLoading } = useFetchGetData(genresUrl);
    // console.log({ artistsData });
    // console.log({ genresData });
    console.log({ numberArtistSelection, numberGenreSelection });

    useEffect(() => {
        if (artistsData === null || genresData === null) {
            return;
        }

        setArtistSelectionValue(artistsData !== null ? artistsData.beData[0].artist : null);
        setGenreSelectionValue(genresData !== null ? genresData.beData[0].genre : null);
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
        // increaseArtistNumberSelection();
        setNumberArtistSelection((prev) => prev + 1);
    };

    const handleDeleteArtistBtn = () => {
        // decreaseArtistNumberSelection();
        setNumberArtistSelection((prev) => {
            if (prev - 1 === 0) return 1;
            return prev - 1;
        });
    };

    const handleAddGenreBtn = () => {
        // increaseGenreNumberSelection();
        setNumberGenreSelection((prev) => prev + 1);
    };

    const handleDeleteGenreBtn = () => {
        // decreaseGenreNumberSelection();
        setNumberGenreSelection((prev) => {
            if (prev - 1 === 0) return 1;
            return prev - 1;
        });
    };

    const handleGenreSelectionOnChange = (selectionValue) => {
        setGenreSelectionValue(selectionValue);
    };

    const handleArtistSelectionOnChange = (selectionValue) => {
        setArtistSelectionValue(selectionValue);
    };

    const handleSubmitBtn = async (e) => {
        e.preventDefault();
        console.log({ inpValue, genreSelectionValue, artistSelectionValue });
        console.log(
            JSON.stringify({
                song: inpValue.toLowerCase(),
                genre: genreSelectionValue,
                artist: artistSelectionValue,
            }),
        );

        if (inpError !== null) return;

        const res = await fetch(beUrl, {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                song: inpValue.toLowerCase(),
                genre: genreSelectionValue,
                artist: artistSelectionValue,
            }),
        });

        const data = res.json();

        if (res.ok === false) {
            throw new Error(data.errors?.[0]?.msg || 'Request failed');
        }

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
                                {numberArtistSelection === 1 && (
                                    <Selection
                                        selectionLabel={'Artist'}
                                        selectionId={'artists'}
                                        selectionType={'artists'}
                                        selectionOptsList={artistsData.beData}
                                        selectionOnChangeHandle={handleArtistSelectionOnChange}
                                    ></Selection>
                                )}
                                {numberArtistSelection > 1 && (
                                    <div className="selectionsWrapper">
                                        {[...Array(numberArtistSelection)].map((_, index) => {
                                            return (
                                                <div key={index}>
                                                    <Selection
                                                        selectionLabel={`Artist ${index + 1}`}
                                                        selectionId={'artists'}
                                                        selectionType={'artists'}
                                                        selectionOptsList={artistsData.beData}
                                                        selectionOnChangeHandle={handleArtistSelectionOnChange}
                                                    ></Selection>
                                                    <DeleteBtn onClickHandler={handleDeleteArtistBtn}></DeleteBtn>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                        {genresLoading === false && genresError === null && genresData !== null && (
                            <>
                                {numberGenreSelection === 1 && (
                                    <Selection
                                        selectionLabel={'Genre'}
                                        selectionId={'genres'}
                                        selectionType={'genres'}
                                        selectionOptsList={genresData.beData}
                                        selectionOnChangeHandle={handleGenreSelectionOnChange}
                                    ></Selection>
                                )}
                                {numberGenreSelection > 1 && (
                                    <div className="selectionsWrapper">
                                        {[...Array(numberGenreSelection)].map((_, index) => {
                                            return (
                                                <div key={index}>
                                                    <Selection
                                                        selectionLabel={`Genre ${index + 1}`}
                                                        selectionId={'genres'}
                                                        selectionType={'genres'}
                                                        selectionOptsList={genresData.beData}
                                                        selectionOnChangeHandle={handleGenreSelectionOnChange}
                                                    ></Selection>
                                                    <DeleteBtn onClickHandler={handleDeleteGenreBtn}></DeleteBtn>
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
