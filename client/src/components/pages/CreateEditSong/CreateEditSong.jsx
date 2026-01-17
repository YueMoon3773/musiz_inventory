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

import './CreateEditSong.scss';

const createEditSongSchema = z.object({
    pageType: z.string(),
    target: z.string(),
});

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
    const [genreSelectionValue, setGenreSelectionValue] = useState(null);
    const [artistSelectionValue, setArtistSelectionValue] = useState(null);

    const { data: artistsData, error: artistsError, loading: artistsLoading } = useFetchGetData(artistsUrl);
    const { data: genresData, error: genresError, loading: genresLoading } = useFetchGetData(genresUrl);
    // console.log({ artistsData });
    // console.log({ genresData });

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
                            <Selection
                                selectionLabel={'Artist'}
                                selectionId={'artists'}
                                selectionType={'artists'}
                                selectionOptsList={artistsData.beData}
                                selectionOnChangeHandle={handleArtistSelectionOnChange}
                            ></Selection>
                        )}
                        {genresLoading === false && genresError === null && genresData !== null && (
                            <Selection
                                selectionLabel={'Genre'}
                                selectionId={'genres'}
                                selectionType={'genres'}
                                selectionOptsList={genresData.beData}
                                selectionOnChangeHandle={handleGenreSelectionOnChange}
                            ></Selection>
                        )}
                    </>
                </CreateEditPageLayout>
            )}
        </>
    );
};

// export default CreateEditSong;
export default ValidatedComponent(CreateEditSong, createEditSongSchema);
