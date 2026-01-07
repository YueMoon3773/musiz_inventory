import App from '../App';
import ErrorPage from '../components/pages/ErrorPage/ErrorPage';

const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        // element: <ErrorPage />,
    },
    {
        // path: '/profile/:name?',
        // element: <Profile />,
    },
];

export default routes;
