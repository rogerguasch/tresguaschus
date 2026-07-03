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

@boostsnippet('Example Action class', 'php')
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
@endboostsnippet
