import { useState } from 'react';

import PageLayout from '../../layout/PageLayout/PageLayout';
import FormInp from '../../base/FormInp/FormInp';

import { artists, genres } from '../../../db/db';

import './CreateEditSong.scss';

const CreateEditSong = () => {
    const [songTitle, setSongTitle] = useState('');

    const handleChangeSongTitle = (inpValue) => {
        // console.log({ inpValue });

        setSongTitle(inpValue);
    };

    return (
        <PageLayout>
            <h2 className="pageTitle">Create new song</h2>

            <form action="">
                <FormInp
                    inpLabel={'Song title: '}
                    inpName={'songTitle'}
                    inpState={songTitle}
                    inpOnChangeHandler={handleChangeSongTitle}
                ></FormInp>
                <label htmlFor=""></label>
            </form>
        </PageLayout>
    );
};

export default CreateEditSong;
