import { useState, useEffect } from 'react';
import { z } from 'zod';

const urlSchema = z.url();

export const useFetchData = (rawUrl) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = urlSchema.safeParse(rawUrl);

        if (!url.success) {
            setError(new Error('Invalid URL'));
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
            .then((res) => setData(res))
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    setError(err);
                }
            })
            .finally(() => {
                // setLoading(false);
                setTimeout(() => {
                    setLoading(false);
                }, 300);
            });

        return () => controller.abort();
    }, [rawUrl]);

    // console.log({ data, error, loading });
    return { data, error, loading };
};
