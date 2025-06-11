<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use Rector\Exception\Configuration\InvalidConfigurationException;
use Rector\Php83\Rector\ClassMethod\AddOverrideAttributeToOverriddenMethodsRector;

try {
    return RectorConfig::configure()
        ->withPaths([
            __DIR__.'/app',
            __DIR__.'/bootstrap/app.php',
            __DIR__.'/database',
            __DIR__.'/public',
            __DIR__.'/tests',
        ])
        ->withSkip([
            AddOverrideAttributeToOverriddenMethodsRector::class,
        ])
        ->withPreparedSets(
            deadCode: true,
            codeQuality: true,
            typeDeclarations: true,
            privatization: true,
            earlyReturn: true,
            strictBooleans: true,
        )
        ->withPhpSets(php84: true);
} catch (InvalidConfigurationException $e) {
    dd('Rector configuration error: '.$e->getMessage());
}
