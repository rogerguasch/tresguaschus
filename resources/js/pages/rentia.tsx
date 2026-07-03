import { RentiaApp } from '@/components/rentia/rentia-app';
import { Head } from '@inertiajs/react';

export default function Rentia() {
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
            <RentiaApp />
        </>
    );
}
