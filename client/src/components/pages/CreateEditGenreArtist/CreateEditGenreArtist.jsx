import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useBaseBeUrl } from '../../../hooks/useStorage';
import ValidatedComponent from '../../../utils/validateComponentProps';

import CreateEditPageLayout from '../../layout/CreateEditPageLayout/CreateEditPageLayout';

import './CreateEditGenreArtist.scss';

const createEditGenreArtistSchema = z.object({
    pageType: z.string(),
    target: z.string(),
});

const CreateEditGenreArtist = ({ pageType, target }) => {
    const navigate = useNavigate();
    const inpLabel = (text) => String(text).charAt(0).toUpperCase() + String(text).slice(1);
    const { baseUrl } = useBaseBeUrl();
    const beUrl = `${baseUrl}/${pageType}-${target}`;
    const artistsUrl = `${baseUrl}/artists`;
    const genresUrl = `${baseUrl}/genres`;
    // console.log({ beUrl });

    const [inpValue, setInpValue] = useState('');
    const [inpError, setInpError] = useState(null);
    const [isInpInteracted, setIsInpInteracted] = useState(false);

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

    const handleSubmitBtn = async (e) => {
        e.preventDefault();

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
                body: JSON.stringify({ [target]: inpValue.toLowerCase() }),
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

// export default CreateEditGenreArtist;
export default ValidatedComponent(CreateEditGenreArtist, createEditGenreArtistSchema);
