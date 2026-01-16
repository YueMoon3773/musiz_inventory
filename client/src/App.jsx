import PageLayout from './components/layout/PageLayout/PageLayout';

import './App.scss';

function App() {
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
