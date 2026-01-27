import App from '../App';
import ErrorPage from '../components/pages/ErrorPage/ErrorPage';
import SongsPage from '../components/pages/SongsPage/SongsPage';
import CreateEditSong from '../components/pages/CreateEditSong/CreateEditSong';
import CreateEditGenreArtist from '../components/pages/CreateEditGenreArtist/CreateEditGenreArtist';
import GenresOrArtistsPage from '../components/pages/GenresOrArtistsPage/GenresOrArtistsPage';
import ASongDetailsPage from '../components/pages/ASongDetailsPage/ASongDetailsPage';

const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        // element: <ErrorPage />,
    },
    {
        path: '/songs',
        element: <SongsPage pageType="songs" />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/genres',
        element: <GenresOrArtistsPage pageType="genres" />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/artists',
        element: <GenresOrArtistsPage pageType="artists" />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/create-song',
        element: <CreateEditSong pageType="create" target="song" />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/edit-song/:id',
        element: <CreateEditSong pageType="edit" target="song" />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/create-genre',
        element: <CreateEditGenreArtist pageType="create" target="genre" />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/edit-genre/:id',
        element: <CreateEditGenreArtist pageType="edit" target="genre" />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/create-artist',
        element: <CreateEditGenreArtist pageType="create" target="artist" />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/edit-artist/:id',
        element: <CreateEditGenreArtist pageType="edit" target="artist" />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/song-details/:id',
        element: <ASongDetailsPage />,
        errorElement: <ErrorPage />,
    },
];

export default routes;
