import { createContext, use } from 'react';
import type { RentalStore } from './use-rental';

const RentalContext = createContext<RentalStore | null>(null);

export const RentalProvider = RentalContext.Provider;

export function useRentalContext(): RentalStore {
    const store = use(RentalContext);
    if (!store) {
        throw new Error(
            'useRentalContext must be used within a <RentalProvider>.',
        );
    }
    return store;
}
