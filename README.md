# Tresguaschus

Project to manage and visualize information about the Tres Guaschus.

## Installation

```bash
git clone https://github.com/youruser/tresguaschus.git
cd tresguaschus
npm install
```

## Usage

```bash
npm start
```

## Test Scripts (composer run test)

The `composer run test` command executes the following scripts, in order:

1. `@php artisan config:clear --ansi`
2. `@test:refactor` (`rector`)
3. `@test:lint` (`pint --test`)
4. `@test:type-coverage` (`pest --type-coverage --parallel --exactly=100`)
5. `@test:typos` (`peck`)
6. `@test:unit` (`pest --colors=always --coverage --parallel --min=80`)

These scripts are defined in the `composer.json` file and allow you to clear configuration, refactor, lint, check type coverage, find typos, and run unit tests.

To run them, use:

```bash
composer run test
```

## Contributing

Contributions are welcome. Please open an issue or pull request.

## License

MIT

