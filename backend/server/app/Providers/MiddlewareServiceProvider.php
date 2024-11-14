<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class MiddlewareServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot()
    {
        $router = $this->app['router'];

        $router->aliasMiddleware('check.admin', \App\Http\Middleware\CheckAdminRole::class);
    }
}
