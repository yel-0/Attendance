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
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Imports\StudentClassImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;




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


    public function importExcel(Request $request)
    {
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv|max:2048', // Validate file type and size
        ]);
    
        try {
            // Load the file into a collection
            $rows = Excel::toCollection(null, $request->file('file'))[0];
    
            // Extract student_id and classroom_id values from the file
            $studentIds = $rows->pluck(0); // Assuming student_id is in the first column
            $classroomIds = $rows->pluck(1); // Assuming classroom_id is in the second column
    
            // Check for duplicate student_id values in the file
            if ($studentIds->duplicates()->isNotEmpty()) {
                return response()->json([
                    'message' => 'Duplicate student_id values found in the file.',
                ], 422);
            }
    
            $errors = []; // To store errors for failed rows
    
            // Start a database transaction
            DB::beginTransaction();
    
            // Check if student_id and classroom_id exist in the database
            foreach ($rows as $index => $row) {
                try {
                    $studentId = $row[0];
                    $classroomId = $row[1];
    
                    // Validate if student_id and classroom_id exist in the database
                    $studentExists = Account::find($studentId);
                    $classroomExists = Classroom::find($classroomId);
    
                    if (!$studentExists || !$classroomExists) {
                        $errors[] = "Row {$index}: Invalid student_id or classroom_id.";
                        continue; // Skip to the next row
                    }
    
                    // Check if the student is already associated with the classroom
                    $exists = StudentClass::where('student_id', $studentId)
                                          ->where('classroom_id', $classroomId)
                                          ->exists();
    
                    if ($exists) {
                        $errors[] = "Row {$index}: The student with ID {$studentId} is already associated with classroom {$classroomId}.";
                        continue; // Skip to the next row
                    }
    
                    // Create the student-class association
                    StudentClass::create([
                        'student_id' => $studentId,
                        'classroom_id' => $classroomId,
                    ]);
    
                    // Add attendance records for the new student
                    $classTimes = ClassTime::where('classroom_id', $classroomId)->get();
    
                    foreach ($classTimes as $classTime) {
                        // Create attendance record if it doesn't exist
                        Attendance::firstOrCreate([
                            'student_id' => $studentId,
                            'class_time_id' => $classTime->id,
                        ], [
                            'attended' => false, 
                        ]);
                    }
    
                } catch (\Exception $e) {
                    // Capture any other exceptions and add them to the errors array
                    $errors[] = "Row {$index}: Error processing this row - " . $e->getMessage();
                    continue; // Skip to the next row
                }
            }
    
            // If there are any errors, rollback the transaction
            if (!empty($errors)) {
                DB::rollBack();  // Rollback all changes if there's an error
                return response()->json([
                    'message' => 'Some rows encountered errors.',
                    'errors' => $errors,
                ], 422);
            }
    
            // If everything is fine, commit the transaction
            DB::commit();
    
            // Return success response if no errors
            return response()->json([
                'message' => 'Student classes imported successfully.',
            ], 201);
    
        } catch (\Throwable $e) {
            // Handle any errors and return response
            DB::rollBack();  // Rollback the transaction in case of any unexpected errors
            return response()->json([
                'message' => 'An error occurred while importing the file.',
                'error' => $e->getMessage(),
            ], 500);
        }
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
        $user = JWTAuth::parseToken()->authenticate();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $studentId = $user->id;

        // Fetch classroom IDs associated with the authenticated student's ID
        $classroomIds = StudentClass::where('student_id', $studentId)->pluck('classroom_id');

        // Retrieve the classrooms based on the IDs
        $classrooms = Classroom::whereIn('id', $classroomIds)->get();

        // Return the classrooms as a JSON response
        return response()->json($classrooms);
    }
       
}
