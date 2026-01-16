import { useState, useContext, createContext } from 'react';

const BackEndBaseUrlContext = createContext(null);

export const BackEndBaseUrlProvider = ({ children }) => {
    const baseUrl = 'http://localhost:6600';

    return <BackEndBaseUrlContext.Provider value={{ baseUrl }}>{children}</BackEndBaseUrlContext.Provider>;
};

export const useBaseBeUrl = () => {
    const context = useContext(BackEndBaseUrlContext);

    if (!context) {
        throw new Error('useBaseBeUrl must be used inside BackEndBaseUrlProvider');
    }

    return context;
};
