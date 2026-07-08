<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Transaction\Domain\Models\Transaction;
use App\User\Domain\Models\User;

beforeEach(fn () => $this->actingAs(User::factory()->create()));

it('paginates the transactions table beyond 20 rows', function (): void {
    $category = Category::factory()->create();
    Transaction::factory()->for($category)->count(21)->create();

    $page = visit(route('dashboard'));

    $page->assertNoJavaScriptErrors()
        ->click('Transacciones')
        ->assertSee('21 transacciones')
        ->assertSee('Página 1 de 2')
        ->click('Siguiente')
        ->assertSee('Página 2 de 2')
        ->assertNoJavaScriptErrors();
});

it('does not paginate 20 rows or fewer', function (): void {
    $category = Category::factory()->create();
    Transaction::factory()->for($category)->count(20)->create();

    $page = visit(route('dashboard'));

    $page->click('Transacciones')
        ->assertSee('20 transacciones')
        ->assertDontSee('Página 1 de')
        ->assertNoJavaScriptErrors();
});
