import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { useBaseBeUrl } from '../../../hooks/useStorage';
import { useFetchGetData } from '../../../hooks/useFetchData';
import ValidatedComponent from '../../../utils/validateComponentProps';

import ErrorPage from '../ErrorPage/ErrorPage';
import CreateEditPageLayout from '../../layout/CreateEditPageLayout/CreateEditPageLayout';
import LoadingImg from '../../base/LoadingImg/LoadingImg';

import './CreateEditGenreArtist.scss';
import PageLayout from '../../layout/PageLayout/PageLayout';

const createEditGenreArtistSchema = z.object({
    pageType: z.string(),
    target: z.string(),
});

const bannedNames = [
    'nicki',
    'ni cki',
    'n icki',
    'n i c ki',
    'n i c k i',
    'nic ki',
    'minaj',
    'm ina j',
    'm in a j',
    'm i n a j',
    'mi naj',
    'min aj',
    'nickiminaj',
    'nicki',
    'nickj',
    'njckj',
    'minaj',
    'mjnaj',
    'onika tanya maraj-petty',
    'onika tanya nicki maraj-petty',
    'onika tanya nicki maraj petty',
    'onika tanya nicki maraj',
    'onika tanya nicki minaj',
    'onika tanya maraj petty',
    'onika tanya petty',
    'onika tanya',
    'onikatanyapetty',
    'onika petty',
    'onikatanyamarajpetty',
    'onikatanyamaraj-petty',
    'onika maraj',
    'onikamaraj',
    'maraj',
    'onika tanya maraj',
    'maraj-petty',
    'maraj',
    'marajpetty',
    'barbs',
];

const bannedNamesRegex = new RegExp(`\\b(${bannedNames.join('|')})\\b`, 'i');

const CreateGenreArtist = ({
    pageType,
    target,
    beUrl,
    formInpSchema,
    inpValue,
    handleChangeSongTitle,
    handleOnBlurInp,
    inpError,
    setInpError,
    isInpInteracted,
    setIsInpInteracted,
}) => {
    const navigate = useNavigate();
    // console.log({ beUrl });

    const handleSubmitBtn = async () => {
        try {
            // console.log({ inpValue });
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
                body: JSON.stringify({ [`${target}s`]: inpValue.toLowerCase() }),
            });

            const data = await res.json();

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
        <CreateEditPageLayout
            pageType={pageType}
            target={target}
            inpValue={inpValue}
            handleChangeInpValue={handleChangeSongTitle}
            handleOnBlurInp={handleOnBlurInp}
            inpError={inpError}
            isInpInteracted={isInpInteracted}
            handleSubmitBtn={handleSubmitBtn}
        ></CreateEditPageLayout>
    );
};

const EditGenreArtist = ({
    pageType,
    target,
    baseUrl,
    beUrl,
    formInpSchema,
    inpValue,
    setInpValue,
    handleChangeSongTitle,
    handleOnBlurInp,
    inpError,
    setInpError,
    isInpInteracted,
    setIsInpInteracted,
}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fetchUrl = `${beUrl}/${id}`;
    // console.log(fetchUrl);

    const { data, error, loading } = useFetchGetData(fetchUrl);
    // console.log({ data, error, loading });

    useEffect(() => {
        if (data === null) return;
        setInpValue(data.beData[0][`${target}`]);
    }, [data]);

    const handleSubmitBtn = async () => {
        try {
            const result = formInpSchema.safeParse(inpValue);
            setInpError(result.success ? null : result.error.issues[0].message);
            setIsInpInteracted(true);

            if (!result.success || inpError !== null) {
                throw new Error('Input value is invalid', { cause: result.error.issues[0].message });
            }

            const res = await fetch(fetchUrl, {
                mode: 'cors',
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    [`${target}Id`]: Number(id),
                    [`${target}s`]: inpValue.toLowerCase(),
                }),
            });

            const data = await res.json();

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
            throw new Error('Failed to update', { cause: err });
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
            {loading === false && data === null && error !== null ? (
                <ErrorPage errorText="Can not retrieve data, please try again later!"></ErrorPage>
            ) : (
                <>
                    {loading === true && (
                        <PageLayout>
                            <LoadingImg></LoadingImg>
                        </PageLayout>
                    )}
                    {loading === false && data !== null && error === null && (
                        <CreateEditPageLayout
                            pageType={pageType}
                            target={target}
                            targetId={Number(id)}
                            targetIsEditable={true}
                            inpValue={inpValue}
                            handleChangeInpValue={handleChangeSongTitle}
                            handleOnBlurInp={handleOnBlurInp}
                            inpError={inpError}
                            isInpInteracted={isInpInteracted}
                            handleSubmitBtn={handleSubmitBtn}
                            handleDeleteBtn={handleDeleteBtn}
                        ></CreateEditPageLayout>
                    )}
                </>
            )}
        </>
    );
};

const CreateEditGenreArtist = ({ pageType, target }) => {
    const inpLabel = (text) => String(text).charAt(0).toUpperCase() + String(text).slice(1);
    const { baseUrl } = useBaseBeUrl();
    const beUrl = `${baseUrl}/${pageType}-${target}`;
    // console.log({ beUrl });

    const [inpValue, setInpValue] = useState('');
    const [inpError, setInpError] = useState(null);
    const [isInpInteracted, setIsInpInteracted] = useState(false);

    const formInpSchema = z
        .string()
        .min(2, `${inpLabel(target)} name must be at least 2 characters.`)
        .max(30, `${inpLabel(target)} name must be shorter than 30 characters.`)
        .refine((val) => !bannedNamesRegex.test(val), { message: 'Nicku Ma gAj is restricted. F*ck nucku!' })
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

    if (pageType === 'create') {
        return (
            <CreateGenreArtist
                pageType={pageType}
                target={target}
                beUrl={beUrl}
                formInpSchema={formInpSchema}
                inpValue={inpValue}
                handleChangeSongTitle={handleChangeSongTitle}
                handleOnBlurInp={handleOnBlurInp}
                inpError={inpError}
                setInpError={setInpError}
                isInpInteracted={isInpInteracted}
                setIsInpInteracted={setIsInpInteracted}
            ></CreateGenreArtist>
        );
    } else if (pageType === 'edit') {
        return (
            <EditGenreArtist
                pageType={pageType}
                target={target}
                baseUrl={baseUrl}
                beUrl={beUrl}
                formInpSchema={formInpSchema}
                inpValue={inpValue}
                setInpValue={setInpValue}
                handleChangeSongTitle={handleChangeSongTitle}
                handleOnBlurInp={handleOnBlurInp}
                inpError={inpError}
                setInpError={setInpError}
                isInpInteracted={isInpInteracted}
                setIsInpInteracted={setIsInpInteracted}
            ></EditGenreArtist>
        );
    }
};

export default ValidatedComponent(CreateEditGenreArtist, createEditGenreArtistSchema);
