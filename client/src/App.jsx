import { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import ''

import { useFetchData } from './hooks/useFetchData';

import PageLayout from './components/layout/PageLayout/PageLayout';
// import Selection from './components/base/Selection/Selection';
import ControllerSection from './components/layout/ControllerSection/ControllerSection';
import InventoryItem from './components/base/InventoryItem/InventoryItem';
import LoadingImg from './components/base/LoadingImg/LoadingImg';
// import { AddIcon } from './assets/svg/svgIcons';

import SongsPage from './components/pages/SongsPage/SongsPage';

// import pageStyles from './styles/modules/basePageStyles.module.scss';
import './App.scss';

const songsPageURL = 'http://localhost:6600/';

function App() {
    // const navigate = useNavigate();
    // const { data, error, loading } = useFetchData(songsPageURL);
    // // console.log({ data, error, loading });
    return (
        <PageLayout>
            <h1 className="welcomeText">Welcome to Musiz Library</h1>

            <p className="infoText">You can easily manage your music library by genres and artists with this app.</p>
            <h2 className="startText">Getting Started</h2>

            <div className="manualWrapper">
                <p className="manualText">⭐ Create new artists and genres to organize your songs.</p>
                <p className="manualText">⭐ Add songs with your favorite artist and genres.</p>
                <p className="manualText">⭐ View and manage your songs, artist, genres at a glance.</p>
            </div>
            <p className="manualText">
                <span>NOTE:</span> You can't edit/delete default songs/artists/genres.
            </p>
        </PageLayout>
    );
}

export default App;
