import App from '../App';
import ErrorPage from '../components/pages/ErrorPage/ErrorPage';
import CreateEditSong from '../components/pages/CreateEditSong/CreateEditSong';

const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        // element: <ErrorPage />,
    },
    {
        path: '/create_song',
        element: <CreateEditSong />,
    },
];

export default routes;
