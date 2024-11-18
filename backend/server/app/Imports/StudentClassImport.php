<?php

namespace App\Imports;

use App\Models\StudentClass;
use App\Models\Account;
use App\Models\Classroom;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;

class StudentClassImport implements ToModel
{
    public function model(array $row)
    {
        // Check if the student ID exists
        $student = Account::find($row[0]); // Assuming student ID is in the first column
        if (!$student) {
            Log::error("Student ID {$row[0]} not found.");
            return null; // Skip this row if student doesn't exist
        }

        // Check if the classroom ID exists
        $classroom = Classroom::find($row[1]); // Assuming classroom ID is in the second column
        if (!$classroom) {
            Log::error("Classroom ID {$row[1]} not found.");
            return null; // Skip this row if classroom doesn't exist
        }

        // Return a new StudentClass instance
        return new StudentClass([
            'student_id' => $row[0],
            'classroom_id' => $row[1],
        ]);
    }
}
