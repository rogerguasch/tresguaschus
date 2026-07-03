import { createContext, use } from 'react';
import type { RentiaStore } from './use-rentia';

const RentiaContext = createContext<RentiaStore | null>(null);

export const RentiaProvider = RentiaContext.Provider;

export function useRentiaContext(): RentiaStore {
    const store = use(RentiaContext);
    if (!store) {
        throw new Error(
            'useRentiaContext must be used within a <RentiaProvider>.',
        );
    }
    return store;
}
