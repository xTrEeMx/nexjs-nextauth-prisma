'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Progressbar from '@/components/progressbar';

const AppStateContext = createContext(null);

export const AppStateProvider = ({ children }) => {
    const [loadingStack, setLoadingStack] = useState([]);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        setIsActive(!document.hidden);

        const handleVisibilityChange = () => {
            setIsActive(!document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const loadingStart = (object) => {
        setLoadingStack((prev) => [...prev, object]);
    };

    const loadingFinish = (object) => {
        setLoadingStack((prev) => prev.filter((item) => item !== object));
    };

    const isLoading = (object = '') => {
        return object ? loadingStack.includes(object) : loadingStack.length > 0;
    };

    const isBusy = () => {
        return loadingStack.length > 0;
    };

    return (
        <AppStateContext.Provider value={{isActive, loadingStart, loadingFinish, isLoading, isBusy}}>
            {isBusy() &&
                <Progressbar />
            }
            {children}
        </AppStateContext.Provider>
    );
};

export const useAppState = () => useContext(AppStateContext);
