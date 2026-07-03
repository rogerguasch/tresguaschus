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

@boostsnippet('Module / bounded-context layout', 'text')
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
@endboostsnippet
