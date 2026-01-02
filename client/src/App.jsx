import { useState, useEffect } from 'react';
import './App.scss';

function App() {
    const [items, setItems] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:6600/', {
                    mode: 'cors',
                });
                const data = await res.json();
                console.log('data received: ', data);

                setItems(data.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <div>
                <h1>Hi</h1>
                {typeof items === 'undefined' ? (
                    <p>Fetching data...</p>
                ) : (
                    items.map((item, index) => {
                        return <p key={index}>{item.username}</p>;
                    })
                )}
            </div>
        </>
    );
}

export default App;
