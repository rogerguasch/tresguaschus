import AppearanceTabs from '@/components/appearance-tabs';
import { dashboard } from '@/routes';
import { Head, Link } from '@inertiajs/react';

export default function Update() {
    return (
        <>
            <Head title="Apariencia — Tresguaschus" />
            <div className="mx-auto max-w-xl p-8">
                <Link
                    href={dashboard()}
                    className="text-sm text-zinc-500 hover:text-zinc-900"
                >
                    ← Volver al panel
                </Link>
                <h1 className="mt-4 text-xl font-bold tracking-tight">
                    Apariencia
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                    Elige el tema de la interfaz.
                </p>
                <div className="mt-6">
                    <AppearanceTabs />
                </div>
            </div>
        </>
    );
}
