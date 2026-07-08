<laravel-boost-guidelines>
=== .ai/app.actions rules ===

# Action Pattern guidelines

- This application uses the **Action pattern**: business logic lives in small, reusable, composable Action classes — not in controllers, jobs, or commands.
- Actions live in their bounded context's Application layer: `app/{Context}/Application/Actions` (namespace `App\{Context}\Application\Actions`). See the architecture (DDD modules) guidelines. Do not create new actions in the flat `app/Actions` folder.
- Each Action does one thing, is named after what it does, and carries the `Action` suffix (e.g. `PayInvoiceAction`, `RegisterUserAction`). This is the suffix `make:action` enforces.
- Every Action exposes a single public `handle()` method with explicit, fully-typed parameters and return type.
- Inject collaborators (other Actions, services, repositories) via the constructor as promoted `private readonly` properties. Actions with no dependencies may omit the constructor and use `handle()` alone.
- Actions are called from many entry points: controllers, jobs, commands, HTTP/API/MCP requests, listeners. Keep them free of delivery concerns (no `Request`, no HTTP responses) so any caller can reuse them.
- Wrap multi-model / multi-step writes in `DB::transaction()` inside the Action.
- Actions may compose other Actions; keep the dependency direction pointing toward `Domain`.
- Create actions with the qualified context namespace so the file lands in the right module:
    - `php artisan make:action "App\{Context}\Application\Actions\{Name}" --no-interaction`

<!-- Example Action class -->
```php
<?php

declare(strict_types=1);

namespace App\Billing\Application\Actions;

use App\Billing\Domain\Models\Invoice;
use App\Billing\Domain\Events\InvoicePaid;
use Illuminate\Support\Facades\DB;

final readonly class PayInvoiceAction
{
    public function __construct(private ChargeCardAction $chargeCard)
    {
        //
    }

    public function handle(Invoice $invoice, string $paymentToken): Invoice
    {
        return DB::transaction(function () use ($invoice, $paymentToken): Invoice {
            $this->chargeCard->handle($invoice->total, $paymentToken);

            $invoice->markAsPaid();

            event(new InvoicePaid($invoice));

            return $invoice;
        });
    }
}
```

=== .ai/architecture.modules rules ===

# Architecture — DDD Modules / Bounded Contexts

- This application is organized into **DDD bounded contexts** ("modules"): one top-level folder per context, directly under `app/`.
- Name a context after a **business capability** (e.g. `Billing`, `Identity`, `Catalog`, `Shipping`), never after a technical layer.
- The namespace root of a context is `App\{Context}` (e.g. `App\Billing`).
- Inside every context you MUST use exactly three layers:
    - `Domain/` — the heart of the context: Eloquent Models, Enums, Value Objects, domain Events, domain Exceptions. Pure business rules; no HTTP or request/response concerns.
    - `Application/` — the use cases: **Action** classes (see the App/Actions guidelines) and DTOs that orchestrate the domain.
    - `Infrastructure/` — the framework edges & delivery: `Http/Controllers`, `Http/Requests`, `Jobs`, `Console`, `Listeners`, `Policies`, and external-service adapters.
- Do NOT add new code to the flat, framework-default `app/Http`, `app/Models`, `app/Actions`, etc. Place new code inside the owning context. Existing scaffolding may remain until it is migrated, but do not grow it.
- **Dependency direction inside a context:** `Infrastructure` → `Application` → `Domain`. Never the reverse. `Domain` knows nothing about `Application` or `Infrastructure`.
- **Cross-context communication** goes through the other context's `Application` (Actions) or its published `Domain` contracts/DTOs. Never reach into another context's `Infrastructure`, and never depend on another context's `Infrastructure` from your own.
- Keep contexts loosely coupled: share only Domain contracts, DTOs, or Events between them.
- Route files stay in `routes/`, but must point to controllers living in `App\{Context}\Infrastructure\Http\Controllers`.

<!-- Module / bounded-context layout -->
```text
app/
  Billing/                                 # bounded context

    Domain/
      Models/Invoice.php                   # App\Billing\Domain\Models\Invoice

      Enums/InvoiceStatus.php
      ValueObjects/Money.php
      Events/InvoicePaid.php
    Application/
      Actions/PayInvoiceAction.php         # App\Billing\Application\Actions\PayInvoiceAction

      DTOs/PayInvoiceData.php
    Infrastructure/
      Http/Controllers/InvoiceController.php
      Http/Requests/PayInvoiceRequest.php
      Jobs/SendInvoiceReceipt.php
  Identity/                                # another bounded context

    Domain/
    Application/
    Infrastructure/
```

=== .ai/general rules ===

# General Guidelines

- Don't include any superfluous PHP Annotations, except ones that start with `@` for typing variables.
- Start the project with `composer run dev`, which boots the full local development environment.

=== .ai/nuno.style rules ===

# Code Style — Nuno Maduro Essentials

This project follows the opinionated, strict style shipped by `nunomaduro/essentials` (already installed and enabled). All new PHP code MUST match it.

- Every PHP file starts with `declare(strict_types=1);`.
- Classes are `final` by default. Make them `final readonly` when they hold no mutable state (Actions, DTOs, Value Objects, stateless Services, most Controllers).
- Always declare explicit parameter and return types on every method and function; never leave a signature untyped. Use `void`/`never` where they apply.
- Use PHP 8 constructor property promotion; inject dependencies as promoted `private` (or `private readonly`) properties. No empty non-private constructors.
- Models: declare casts in the `casts()` method (not the `$casts` property), add `@property-read` PHPDoc for attributes, and rely on strict mode instead of hand-guarding.
- The framework runs with the essentials strictness enabled — respect it, never disable it:
    - `ShouldBeStrict` (no lazy loading, no silently discarded attributes, no missing-attribute access).
    - `ImmutableDates` (all Carbon dates are `CarbonImmutable`).
    - `AutomaticallyEagerLoadRelationships` (relationships auto-eager-load; still be intentional about what you touch).
    - `ProhibitDestructiveCommands` (destructive Artisan commands are blocked outside local).
    - `PreventStrayRequests` (unfaked HTTP requests fail in tests — fake them).
    - `SetDefaultPassword` (12+ char, uncompromised password rule by default).
- Do not unguard models and do not weaken any of the above.
- Enums: `TitleCase` cases, backed enums with an explicit backing type.
- Keep the flow thin and one-directional: Form Request validates → Controller delegates to an Action → Action returns a result. No business logic in controllers.
- No superfluous PHP annotations; only keep `@` docblocks that add type information (generics, array shapes, `@property-read`).

=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.4
- inertiajs/inertia-laravel (INERTIA_LARAVEL) - v3
- laravel/fortify (FORTIFY) - v1
- laravel/framework (LARAVEL) - v13
- laravel/prompts (PROMPTS) - v0
- laravel/wayfinder (WAYFINDER) - v0
- larastan/larastan (LARASTAN) - v3
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- rector/rector (RECTOR) - v2
- @inertiajs/react (INERTIA_REACT) - v3
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- @laravel/vite-plugin-wayfinder (WAYFINDER_VITE) - v0
- eslint (ESLINT) - v10
- prettier (PRETTIER) - v3

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== wayfinder/core rules ===

# Laravel Wayfinder

Use Wayfinder to generate TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `php artisan make:test --pest SomeFeatureTest` instead of `php artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

</laravel-boost-guidelines>
