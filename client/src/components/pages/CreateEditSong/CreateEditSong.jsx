import { useState } from 'react';

import PageLayout from '../../layout/PageLayout/PageLayout';
import FormInp from '../../base/FormInp/FormInp';
import Selection from '../../base/Selection/Selection';
import SubmitBtn from '../../base/SubmitBtn/SubmitBtn';
import DeleteBtn from '../../base/DeleteBtn/DeleteBtn';

import { artists, genres } from '../../../db/db';

import pageStyles from '../../../styles/modules/basePageStyles.module.scss';
import './CreateEditSong.scss';

const CreateEditSong = ({ pageType }) => {
    const [songTitle, setSongTitle] = useState('');

    const handleChangeSongTitle = (inpValue) => {
        // console.log({ inpValue });
        setSongTitle(inpValue);
    };

    return (
        <PageLayout>
            <h2 className="pageTitle">
                {pageType === 'create' && 'Create new song'}
                {pageType === 'edit' && 'Edit song'}
            </h2>

            <form action="">
                <FormInp
                    inpLabel={'Song title: '}
                    inpName={'songTitle'}
                    inpState={songTitle}
                    inpOnChangeHandler={handleChangeSongTitle}
                ></FormInp>

                <Selection
                    selectionLabel={'Artist'}
                    selectionId={'artists'}
                    selectionType={'artists'}
                    selectionOptsList={artists}
                ></Selection>

                <Selection
                    selectionLabel={'Genre'}
                    selectionId={'genres'}
                    selectionType={'genres'}
                    selectionOptsList={genres}
                ></Selection>

                <div className="formBtns">
                    <SubmitBtn></SubmitBtn>
                    {pageType === 'edit' && <DeleteBtn></DeleteBtn>}
                </div>
            </form>
        </PageLayout>
    );
};

export default CreateEditSong;
