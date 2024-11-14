<?php

namespace App\Http\Controllers;

use App\Models\StudentClass;
use App\Models\Classroom;
use App\Models\ClassTime;
use App\Models\Attendance;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class StudentClassController extends Controller
{
    // Method to assign a student to a classroom
    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:accounts,id',
            'classroom_id' => 'required|exists:classrooms,id',
        ]);
    
        // Check if the student is already associated with the classroom
        $exists = StudentClass::where('student_id', $request->input('student_id'))
                              ->where('classroom_id', $request->input('classroom_id'))
                              ->exists();
    
        if ($exists) {
            return response()->json([
                'message' => 'The student is already associated with this classroom.'
            ], Response::HTTP_CONFLICT);
        }
    
        // Create the student-class association
        $studentClass = StudentClass::create([
            'student_id' => $request->input('student_id'),
            'classroom_id' => $request->input('classroom_id'),
        ]);
    
        // Add attendance records for the new student
        $classTimes = ClassTime::where('classroom_id', $request->input('classroom_id'))->get();
    
        foreach ($classTimes as $classTime) {
            // Create attendance record if it doesn't exist
            Attendance::firstOrCreate([
                'student_id' => $request->input('student_id'),
                'class_time_id' => $classTime->id,
            ], [
                'attended' => false, 
            ]);
        }
    
        return response()->json($studentClass, Response::HTTP_CREATED);
    }
    

    // Method to remove a student from a classroom
    public function destroy($id)
    {
        $studentClass = StudentClass::findOrFail($id);
        $studentClass->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    // Method to get all student-class associations
    public function index()
    {
        $studentClasses = StudentClass::with(['student', 'classroom'])->get();
        return response()->json($studentClasses);
    }

    // Method to get student-class associations by student ID
    public function getByStudentId($studentId)
    {
        $student = Account::findOrFail($studentId);

        $studentClasses = StudentClass::where('student_id', $studentId)
            ->with('classroom')
            ->get();

        return response()->json($studentClasses);
    }

    // Method to get student-class associations by classroom ID
    public function getByClassroomId($classroomId)
    {
        $classroom = Classroom::findOrFail($classroomId);

        $studentClasses = StudentClass::where('classroom_id', $classroomId)
            ->with('student')
            ->get();

        return response()->json($studentClasses);
    }

       // Method to update a student-class association
       public function update(Request $request, $id)
       {
           $request->validate([
               'student_id' => 'required|exists:accounts,id',
               'classroom_id' => 'required|exists:classrooms,id',
           ]);
       
           // Check if the new student-class association already exists
           $existingStudentClass = StudentClass::where('student_id', $request->input('student_id'))
               ->where('classroom_id', $request->input('classroom_id'))
               ->where('id', '<>', $id) // Exclude the current record
               ->exists();
       
           if ($existingStudentClass) {
               return response()->json([
                   'error' => 'The student is already assigned to this classroom.'
               ], Response::HTTP_CONFLICT);
           }
       
           // Find and update the student-class association
           $studentClass = StudentClass::findOrFail($id);
           $studentClass->update([
               'student_id' => $request->input('student_id'),
               'classroom_id' => $request->input('classroom_id'),
           ]);
       
           return response()->json($studentClass);
       }
       public function showByClassroomId($classroomId)
       {
           // Validate the classroom ID
           $classroom = Classroom::findOrFail($classroomId);
       
           // Retrieve student-class associations by classroom ID
           $studentClasses = StudentClass::with('student') // No need to include classroom here as it's the same for all
               ->where('classroom_id', $classroomId)
               ->get();
       
           return response()->json([
               'classroom' => $classroom, // Optionally include classroom details if needed
               'students' => $studentClasses
           ]);
       }

       public function getClassroomsByAuthStudent(Request $request)
    {
        // Get the authenticated user
        $user = Auth::user();

        // Assuming the authenticated user is a student and has an ID
        $studentId = $user->id;

        // Fetch classroom IDs associated with the authenticated student's ID
        $classroomIds = StudentClass::where('student_id', $studentId)->pluck('classroom_id');

        // Retrieve the classrooms based on the IDs
        $classrooms = Classroom::whereIn('id', $classroomIds)->get();

        // Return the classrooms as a JSON response
        return response()->json($classrooms);
    }
       
}
