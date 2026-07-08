import { Head, usePage } from '@inertiajs/react';

export default function Login() {
    const { props } = usePage<{ flash: { error: string | null } }>();
    const error = props.flash.error;

    return (
        <>
            <Head title="Iniciar sesión — Tresguaschus">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex flex-1 flex-col rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <div>
                                <h1 className="mb-1 text-2xl font-medium lg:text-3xl">
                                    Tresguaschus
                                </h1>
                                <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                    The personal finance app for the Guasch
                                    brothers
                                </p>

                                <div className="flex flex-col items-center gap-3">
                                    <a
                                        href="/auth/google/redirect"
                                        className="inline-flex items-center gap-2 rounded-sm border border-[#DC2626] bg-[#DC2626] px-5 py-1.5 text-sm leading-normal text-white hover:bg-[#B91C1C] dark:border-[#DC2626] dark:bg-[#DC2626] dark:hover:bg-[#B91C1C]"
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Login with Google
                                    </a>
                                    {error && (
                                        <div className="rounded-sm bg-red-50 px-4 py-2 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="mt-auto pt-6 text-center">
                                Built with ❤️ by little brother
                            </p>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#fff2f2] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#1D0002]">
                            <img
                                src="/images/tresguaschus.webp"
                                alt="Tres Guaschus"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
