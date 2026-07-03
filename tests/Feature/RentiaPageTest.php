<?php

declare(strict_types=1);

it('renders the Rentia single-page app', function (): void {
    config()->set('inertia.ssr.enabled', false);
    config()->set('inertia.pages.paths', [resource_path('js/pages')]);
    config()->set('inertia.pages.extensions', ['tsx', 'ts', 'jsx', 'js']);

    $this->get(route('rentia'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('rentia'));
});
