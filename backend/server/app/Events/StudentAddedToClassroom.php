<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\StudentClass;

class StudentAddedToClassroom
{
    use Dispatchable, SerializesModels;

    public $studentClass;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(StudentClass $studentClass)
    {
        $this->studentClass = $studentClass;
    }
}
