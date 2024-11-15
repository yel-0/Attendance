<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSubjectAndSessionToClassroomsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('classrooms', function (Blueprint $table) {
            $table->string('subject')->after('name'); // Add subject column
            $table->string('session')->after('subject'); // Add session column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('classrooms', function (Blueprint $table) {
            $table->dropColumn(['subject', 'session']);
        });
    }
}
