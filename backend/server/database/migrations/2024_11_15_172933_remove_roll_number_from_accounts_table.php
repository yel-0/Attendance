<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->dropColumn('rollNumber');
        });
    }

    public function down()
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->string('rollNumber')->nullable()->unique();
        });
    }
};
