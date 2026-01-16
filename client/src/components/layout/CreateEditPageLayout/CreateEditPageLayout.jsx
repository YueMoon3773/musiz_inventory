import { z } from 'zod';

import ValidatedComponent from '../../../utils/validateComponentProps';

import PageLayout from '../../layout/PageLayout/PageLayout';
import FormInp from '../../base/FormInp/FormInp';
import SubmitBtn from '../../base/SubmitBtn/SubmitBtn';
import DeleteBtn from '../../base/DeleteBtn/DeleteBtn';

import './CreateEditPageLayout.scss';

const createEditPageSchema = z.object({
    pageType: z.string(),
    target: z.string(),
    targetIsEditable: z.boolean().optional(),
    inpValue: z.string(),
    handleChangeInpValue: z.function(),
    handleOnBlurInp: z.function(),
    inpError: z.string().nullable(),
    isInpInteracted: z.boolean(),
    handleSubmitBtn: z.function(),
    handleDeleteBtn: z.function().optional(),
    children: z.unknown().optional(),
});

const CreateEditPageLayout = ({
    pageType,
    target,
    targetIsEditable,
    inpValue,
    handleChangeInpValue,
    handleOnBlurInp,
    inpError,
    isInpInteracted,
    handleSubmitBtn,
    handleDeleteBtn,
    children,
}) => {
    const inpLabel = (text) => String(text).charAt(0).toUpperCase() + String(text).slice(1);

    return (
        <PageLayout>
            <h2 className="pageTitle">
                {pageType === 'create' && `Create new ${target}`}
                {pageType === 'edit' && `Edit ${target}`}
            </h2>

            <form action="">
                <FormInp
                    inpLabel={`${inpLabel(target)} name:`}
                    inpName={`${target}Title`}
                    inpState={inpValue}
                    inpOnChangeHandler={handleChangeInpValue}
                    inpOnBlurHandler={handleOnBlurInp}
                ></FormInp>

                {target !== 'genre' && target !== 'artist' && <>{children}</>}

                {inpError && isInpInteracted && (
                    <div className="errorsWrapper">
                        <p className="errorText">{inpError}</p>
                    </div>
                )}

                <div className="formBtns">
                    <SubmitBtn onClickHandler={handleSubmitBtn}></SubmitBtn>
                    {pageType === 'edit' && targetIsEditable && (
                        <DeleteBtn onClickHandler={handleDeleteBtn}></DeleteBtn>
                    )}
                </div>
            </form>
        </PageLayout>
    );
};

// export default CreateEditPage;
export default ValidatedComponent(CreateEditPageLayout, createEditPageSchema);
