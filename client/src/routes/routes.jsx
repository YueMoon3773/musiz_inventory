import App from '../App';
import ErrorPage from '../components/pages/ErrorPage/ErrorPage';
import SongsPage from '../components/pages/SongsPage/SongsPage';
import CreateEditSong from '../components/pages/CreateEditSong/CreateEditSong';
import GenresOrArtistsPage from '../components/pages/GenresOrArtistsPage/GenresOrArtistsPage';

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
        path: '/create_song',
        element: <CreateEditSong pageType="create" />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/edit_song',
        element: <CreateEditSong pageType="edit" />,
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
    // {
    //     path: '/:pageType',
    //     element: <GenresOrArtistsPage />,
    //     errorElement: <ErrorPage />,
    // },
];

export default routes;
