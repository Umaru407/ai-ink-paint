import { createContext, useContext } from 'react';

const StampStylesContext = createContext();

const stampStyles = [
    {
        id: 1,
        name: 'stamp1_1',
        image: '/stamps/stamp1_1.png',
        aspectRatio: 2,
        type: 'normal'
    },
    {
        id: 2,
        name: 'stamp1_2',
        image: '/stamps/stamp1_2.png',
        aspectRatio: 2,
        type: 'outline'
    },
    {
        id: 3,
        name: 'stamp1_3',
        image: '/stamps/stamp1_3.png',
        aspectRatio: 2,
        type: 'normal'
    },
    {
        id: 4,
        name: 'stamp2_1',
        image: '/stamps/stamp2_1.png',
        aspectRatio: 2,
        type: 'normal'
    },
    {
        id: 5,
        name: 'stamp2_2',
        image: '/stamps/stamp2_2.png',
        aspectRatio: 2,
        type: 'outline'
    },
    {
        id: 6,
        name: 'stamp2_3',
        image: '/stamps/stamp2_3.png',
        aspectRatio: 2,
        type: 'normal'
    },
    {
        id: 7,
        name: 'stamp3_1',
        image: '/stamps/stamp3_1.png',
        aspectRatio: 1,
        type: 'normal'
    },
    {
        id: 8,
        name: 'stamp3_2',
        image: '/stamps/stamp3_2.png',
        aspectRatio: 1,
        type: 'outline'
    },
    {
        id: 9,
        name: 'stamp3_3',
        image: '/stamps/stamp3_3.png',
        aspectRatio: 1,
        type: 'normal'
    },
    {
        id: 10,
        name: 'stamp4_1',
        image: '/stamps/stamp4_1.png',
        aspectRatio: 1,
        type: 'normal'
    },
    {
        id: 11,
        name: 'stamp4_2',
        image: '/stamps/stamp4_2.png',
        aspectRatio: 1,
        type: 'outline'
    }
    ,
    {
        id: 12,
        name: 'stamp4_3',
        image: '/stamps/stamp4_3.png',
        aspectRatio: 1,
        type: 'normal'
    }
];

export const StampStylesProvider = ({ children }) => {
    return <StampStylesContext.Provider value={stampStyles}>{children}</StampStylesContext.Provider>;
};

export const useStampStyles = () => {
    return useContext(StampStylesContext);
};