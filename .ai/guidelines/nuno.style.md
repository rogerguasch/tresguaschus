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
