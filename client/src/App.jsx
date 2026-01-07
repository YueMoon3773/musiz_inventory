import { useState, useEffect, useContext, createContext } from 'react';

import PageLayout from './components/layout/PageLayout/PageLayout';
import InventoryItem from './components/base/InventoryItem/InventoryItem';
import { artists, test } from './db/db';

import './App.scss';

function App() {
    // console.log(artists);

    return (
        <PageLayout>
            <h2 className="pageTitle">Songs</h2>

            <div className="filtersWrapper">
                <label htmlFor="sortField">
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
                </label>

                <label htmlFor="sortOrder">
                    Sort direction
                    <select name="sortOrder" id="sortOrder" className="filter" defaultValue="asc">
                        <option className="filterOpt" value="asc">
                            Ascending (Low to High)
                        </option>
                        <option className="filterOpt" value="desc">
                            Descending (High to Low)
                        </option>
                    </select>
                </label>
            </div>

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
                    {test.map((item, index) => {
                        return <InventoryItem key={index} data={item}></InventoryItem>;
                    })}
                </tbody>
            </table>
        </PageLayout>
    );
}

export default App;
