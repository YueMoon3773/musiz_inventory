import { useState, useContext, createContext, Children } from 'react';

const ActiveNavLinkContext = createContext(null);
const BackEndBaseUrlContext = createContext(null);

export const ActiveNavLinkProvider = ({ children }) => {
    const [activeNavLink, setActiveNavLink] = useState('songs');

    const changeActiveNavLink = (newActiveLink) => {
        setActiveNavLink(newActiveLink);
    };

    return (
        <ActiveNavLinkContext.Provider value={{ activeNavLink, changeActiveNavLink }}>
            {children}
        </ActiveNavLinkContext.Provider>
    );
};

export const useActiveNavLink = () => {
    const context = useContext(ActiveNavLinkContext);

    if (!context) {
        throw new Error('useActiveNavLink must be used inside ActiveNavLinkProvider');
    }

    return context;
};

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
