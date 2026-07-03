import { RentiaApp } from '@/components/rentia/rentia-app';
import type { Category } from '@/components/rentia/types';
import { Head } from '@inertiajs/react';

interface RentiaPageProps {
    categories: Category[];
}

export default function Rentia({ categories }: RentiaPageProps) {
    return (
        <>
            <Head title="Rentia">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <RentiaApp categories={categories} />
        </>
    );
}
