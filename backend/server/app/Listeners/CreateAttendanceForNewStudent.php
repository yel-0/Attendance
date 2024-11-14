<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\ClassTime;
use App\Models\Attendance;
use App\Events\StudentAddedToClassroom;

class CreateAttendanceForNewStudent implements ShouldQueue
{
    use InteractsWithQueue;
    
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(StudentAddedToClassroom $event)
    {
        $student = $event->student;
        $classroomId = $student->classroom_id;

        // Get all existing ClassTime entries for this classroom
        $classTimes = ClassTime::where('classroom_id', $classroomId)->get();

        foreach ($classTimes as $classTime) {
            Attendance::create([
                'student_id' => $student->id,
                'class_time_id' => $classTime->id,
                'attended' => false, // default value
            ]);
        }
    }
}
