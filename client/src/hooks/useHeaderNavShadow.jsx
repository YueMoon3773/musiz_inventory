import { useState, useEffect, useRef } from 'react';

const useHeaderNavShadow = (threshold = 0.2) => {
    const [headerShadow, setHeaderShadow] = useState(false);
    const pageMaker = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entries]) => {
                setHeaderShadow(!entries.isIntersecting);
            },
            { threshold },
        );

        if (pageMaker.current) {
            observer.observe(pageMaker.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [threshold]);

    return { headerShadow, pageMaker };
};

export default useHeaderNavShadow;
