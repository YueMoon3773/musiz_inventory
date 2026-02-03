import { useState, useEffect } from 'react';
import { z } from 'zod';

const urlSchema = z.url();

export const useFetchGetData = (rawUrl) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [urlToFetch, setUrlToFetch] = useState(rawUrl);
    const [refreshKey, setRefreshKey] = useState(0);

    const refetch = () => setRefreshKey((prev) => prev + 1);
    const newFetchUrl = (newUrl) => setUrlToFetch(newUrl);

    useEffect(() => {
        setUrlToFetch(rawUrl);
    }, [rawUrl]);

    useEffect(() => {
        if (!urlToFetch) {
            // setLoading(false);
            return;
        }

        const url = urlSchema.safeParse(urlToFetch);

        if (!url.success) {
            setError(new Error('Invalid URL'));
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        setLoading(true);
        setError(null);
        setData(null);

        fetch(`${url.data}`, { mode: 'cors', signal: controller.signal })
            .then((res) => {
                if (res.ok === false) {
                    throw new Error(`HTTP fetch error ${res.status}`);
                }
                return res.json();
            })
            .then((res) => {
                setData(res);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    setError(err);
                    setLoading(false);
                }
            });
        // .finally(() => {
        //     setLoading(false);
        //     // setTimeout(() => {
        //     //     setLoading(false);
        //     // }, 160);
        // });

        return () => controller.abort();
    }, [urlToFetch, refreshKey]);

    return { data, error, loading, refetch, newFetchUrl };
};
