---
name: ddd-actions
description: >-
  Enforce this project's architecture when writing or editing PHP: DDD bounded-context
  modules under app/{Context} with Domain/Application/Infrastructure layers, the Action
  pattern for business logic, and Nuno Maduro's strict "essentials" code style. Use
  whenever creating or moving a Model, Action, Controller, Request, Job, Enum, DTO, or
  Value Object, deciding where new PHP code belongs, or reviewing PHP for these conventions.
---

# DDD Modules + Action Pattern + Nuno Style

This project is built on three non-negotiable pillars. Apply all three together on every PHP change.

## 1. Bounded contexts (DDD modules)

Code is grouped by **business capability**, one top-level folder per context under `app/`.

```
app/
  Billing/                                 # bounded context — namespace App\Billing
    Domain/
      Models/Invoice.php                   # Eloquent models, business rules
      Enums/InvoiceStatus.php
      ValueObjects/Money.php
      Events/InvoicePaid.php
      Exceptions/InvoiceAlreadyPaid.php
    Application/
      Actions/PayInvoiceAction.php         # use cases (Action pattern)
      DTOs/PayInvoiceData.php
    Infrastructure/
      Http/Controllers/InvoiceController.php
      Http/Requests/PayInvoiceRequest.php
      Jobs/SendInvoiceReceipt.php
      Policies/InvoicePolicy.php
  Identity/                                # another context
    Domain/ Application/ Infrastructure/
```

Rules:
- Name contexts after the business (`Billing`, `Identity`, `Catalog`, `Shipping`), never after a technical layer.
- Namespace root of a context is `App\{Context}`.
- Every context has exactly three layers: **Domain**, **Application**, **Infrastructure**.
- Dependency direction inside a context: `Infrastructure → Application → Domain`. `Domain` depends on nothing outward.
- Cross-context calls go through the other context's `Application` (Actions) or published `Domain` contracts/DTOs/Events. Never touch another context's `Infrastructure`.
- Do **not** add new code to the flat framework defaults (`app/Http`, `app/Models`, `app/Actions`). Existing scaffolding stays until migrated, but never grow it.
- Route files remain in `routes/` and reference controllers in `App\{Context}\Infrastructure\Http\Controllers`.

### Where does each thing go?

| Artifact | Layer | Path |
| --- | --- | --- |
| Eloquent Model | Domain | `app/{Context}/Domain/Models` |
| Enum | Domain | `app/{Context}/Domain/Enums` |
| Value Object | Domain | `app/{Context}/Domain/ValueObjects` |
| Domain Event / Exception | Domain | `app/{Context}/Domain/{Events,Exceptions}` |
| Action (business logic) | Application | `app/{Context}/Application/Actions` |
| DTO | Application | `app/{Context}/Application/DTOs` |
| Controller | Infrastructure | `app/{Context}/Infrastructure/Http/Controllers` |
| Form Request | Infrastructure | `app/{Context}/Infrastructure/Http/Requests` |
| Job / Listener / Policy | Infrastructure | `app/{Context}/Infrastructure/{Jobs,Listeners,Policies}` |

## 2. The Action pattern

Business logic lives in small, composable Action classes — never in controllers, jobs, or commands.

- One Action = one use case, named after what it does, with the `Action` suffix (`PayInvoiceAction`).
- Single public `handle()` method, fully typed parameters and return type.
- Constructor-inject collaborators as promoted `private readonly` properties. No deps → no constructor.
- Free of delivery concerns: no `Request`, no HTTP response — so jobs, commands, MCP, and controllers can all reuse it.
- Wrap multi-step / multi-model writes in `DB::transaction()`.
- Actions may compose other Actions (dependency pointing toward `Domain`).

Create one so it lands in the right module (pass the fully-qualified name — `make:action` forces the `Action` suffix and, given an `App\...` name, writes to the matching path):

```bash
php artisan make:action "App\Billing\Application\Actions\PayInvoice" --no-interaction
# → app/Billing/Application/Actions/PayInvoiceAction.php
```

```php
<?php

declare(strict_types=1);

namespace App\Billing\Application\Actions;

use App\Billing\Domain\Events\InvoicePaid;
use App\Billing\Domain\Models\Invoice;
use Illuminate\Support\Facades\DB;

final readonly class PayInvoiceAction
{
    public function __construct(private ChargeCardAction $chargeCard) {}

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

Controllers stay thin — validate via Form Request, delegate to the Action, return a response:

```php
public function store(PayInvoiceRequest $request, Invoice $invoice, PayInvoiceAction $action): RedirectResponse
{
    $action->handle($invoice, $request->string('payment_token')->value());

    return to_route('invoices.show', $invoice);
}
```

## 3. Nuno Maduro "essentials" strict style

`nunomaduro/essentials` is installed and enabled — match its opinionated defaults, never weaken them.

- `declare(strict_types=1);` at the top of every file.
- Classes are `final` by default; `final readonly` for stateless ones (Actions, DTOs, Value Objects, Services, most Controllers).
- Explicit types on every signature — parameters and returns. Use `void`/`never` where they apply.
- Constructor property promotion; injected deps are promoted `private readonly`.
- Models: casts in the `casts()` method (not `$casts`), `@property-read` PHPDoc, rely on strict mode.
- Respect the enabled runtime strictness — do not disable any of these:
  - `ShouldBeStrict` — no lazy loading, no silently-discarded or missing attributes.
  - `ImmutableDates` — dates are `CarbonImmutable`.
  - `AutomaticallyEagerLoadRelationships` — relationships auto-eager-load; still be intentional.
  - `ProhibitDestructiveCommands`, `PreventStrayRequests` (fake HTTP in tests), `SetDefaultPassword`.
- Enums: `TitleCase` cases, backed with an explicit type.
- No superfluous annotations — keep only `@` docblocks that carry type info (generics, array shapes, `@property-read`).

## Pre-flight checklist before finishing a PHP change

1. Is the file in the correct context and layer? (Not in flat `app/Http`/`app/Models`/`app/Actions`.)
2. Business logic in an Action, not a controller/job/command?
3. `declare(strict_types=1)`, `final`/`final readonly`, fully-typed signatures?
4. No cross-context reach into another context's `Infrastructure`?
5. A Pest test added/updated and passing? Run `php artisan test --compact --filter=...`.
6. `vendor/bin/pint --dirty --format agent` run to fix style.
