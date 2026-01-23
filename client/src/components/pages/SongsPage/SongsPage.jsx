import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useBaseBeUrl } from '../../../hooks/useStorage';
import { useFetchGetData } from '../../../hooks/useFetchData';
import ValidatedComponent from '../../../utils/validateComponentProps';

import PageLayout from '../../../components/layout/PageLayout/PageLayout';
import ControllerSection from '../../../components/layout/ControllerSection/ControllerSection';
import InventoryItem from '../../../components/base/InventoryItem/InventoryItem';
import LoadingImg from '../../../components/base/LoadingImg/LoadingImg';

// import pageStyles from '../../../styles/modules/basePageStyles.module.scss';
import './SongsPage.scss';

const songPageSchema = z.object({
    pageType: z.string(),
});

const SongsPage = ({ pageType }) => {
    const navigate = useNavigate();
    const { baseUrl } = useBaseBeUrl();
    const beUrl = `${baseUrl}/${pageType}`;
    const { data, error, loading, refetch } = useFetchGetData(beUrl);
    // console.log({ beUrl });
    // console.log({ data, error, loading });

    const handleDeleteSongBtn = async (targetId) => {
        const deleteUrl = `${baseUrl}/delete-song/${targetId}`;

        try {
            const res = await fetch(deleteUrl, {
                mode: 'cors',
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.of == false) {
                const message = data.errors.map((e) => e.message).join('\n');
                throw new Error('Delete request failed', { cause: message });
            }

            refetch();
        } catch (err) {
            throw new Error('Failed to delete', { err });
        }
    };

    return (
        <PageLayout>
            <h2 className="pageTitle">Songs</h2>

            <ControllerSection pageType={pageType}></ControllerSection>

            {loading === true && <LoadingImg></LoadingImg>}
            {loading === false && error !== null && data === null && (
                <p className="errorData">Can not retrieve data, please try again later!</p>
            )}
            {loading === false && error === null && data !== null && (
                <table className="displayTable">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Song title</th>
                            <th>Artist</th>
                            <th>Genre</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.beData.map((item, index) => {
                            return (
                                <InventoryItem
                                    key={index}
                                    inventoryType="songs"
                                    data={item}
                                    editBtnHandler={() => {}}
                                    deleteBtnHandler={handleDeleteSongBtn}
                                ></InventoryItem>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </PageLayout>
    );
};

// export default SongsPage;
export default ValidatedComponent(SongsPage, songPageSchema);
