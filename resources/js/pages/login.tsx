import { Head, usePage } from '@inertiajs/react';

export default function Login() {
    const { props } = usePage<{ flash: { error: string | null } }>();

    return (
        <>
            <Head title="Iniciar sesión — Tresguaschus" />
            <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-6">
                <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <h1 className="text-center text-xl font-bold tracking-tight text-zinc-900">
                        Tresguaschus
                    </h1>
                    <p className="mt-1 text-center text-sm text-zinc-500">
                        Accede con tu cuenta de Google
                    </p>

                    {props.flash.error ? (
                        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
                            {props.flash.error}
                        </p>
                    ) : null}

                    <a
                        href="/auth/google/redirect"
                        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
                    >
                        Continuar con Google
                    </a>
                </div>
            </div>
        </>
    );
}
