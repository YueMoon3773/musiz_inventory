import { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import ''

import { useFetchData } from './hooks/useFetchData';

import PageLayout from './components/layout/PageLayout/PageLayout';
import Selection from './components/base/Selection/Selection';
import InventoryItem from './components/base/InventoryItem/InventoryItem';
import LoadingImg from './components/base/LoadingImg/LoadingImg';
import { AddIcon } from './assets/svg/svgIcons';

import pageStyles from './styles/modules/basePageStyles.module.scss';
import './App.scss';

const songsPageURL = 'http://localhost:6600/';

function App() {
    const navigate = useNavigate();

    const { data, error, loading } = useFetchData(songsPageURL);
    // console.log({ data, error, loading });

    const sortField = ['Song title', 'Artist', 'Genre'];
    const sortOrder = ['Ascending (Low to High)', 'Descending (High to Low)'];

    return (
        <PageLayout>
            <h2 className="pageTitle">Songs</h2>

            <div className="controllerWrapper">
                <div className="leftController">
                    {/* <label htmlFor="sortField">
                        Sort by
                        <select name="sortField" id="sortField" className="filter" defaultValue="song">
                            <option className="filterOpt" value="song">
                                Song title
                            </option>
                            <option className="filterOpt" value="artist">
                                Artist
                            </option>
                            <option className="filterOpt" value="genre">
                                Genre
                            </option>
                        </select>
                    </label> */}

                    {/* <label htmlFor="sortOrder">
                        Sort direction
                        <select name="sortOrder" id="sortOrder" className="filter" defaultValue="asc">
                            <option className="filterOpt" value="asc">
                                Ascending (Low to High)
                            </option>
                            <option className="filterOpt" value="desc">
                                Descending (High to Low)
                            </option>
                        </select>
                    </label> */}

                    <Selection
                        selectionLabel={'Sort by'}
                        selectionId={'sortField'}
                        selectionType={'sortField'}
                        selectionOptsList={sortField}
                    ></Selection>

                    <Selection
                        selectionLabel={'Sort direction'}
                        selectionId={'sortOrder'}
                        selectionType={'sortOrder'}
                        selectionOptsList={sortOrder}
                    ></Selection>
                </div>
                <div className="rightController">
                    <button className={`${pageStyles.mainBtn}`} onClick={() => navigate('/create_song')}>
                        <AddIcon></AddIcon> Add new song
                    </button>
                </div>
            </div>

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
                            return <InventoryItem key={index} inventoryType="songs" data={item}></InventoryItem>;
                        })}
                    </tbody>
                </table>
            )}
        </PageLayout>
    );
}

export default App;
