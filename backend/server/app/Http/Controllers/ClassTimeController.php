<?php

namespace App\Http\Controllers;

use App\Models\ClassTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;



class ClassTimeController extends Controller
{
    public function index()
    {
        $classTimes = ClassTime::all();
        return response()->json($classTimes);
    }

   
    public function store(Request $request)
    {
        try {
            // Step 1: Validate the request
            $validator = Validator::make($request->all(), [
                'classroom_id' => 'required|exists:classrooms,id',
                'session_date' => 'required|date',
                'start_time' => 'required|date_format:H:i',
                'end_time' => 'required|date_format:H:i|after:start_time',
            ]);
        
            if ($validator->fails()) {
                Log::error('Validation errors: ' . json_encode($validator->errors()));
                return response()->json(['errors' => $validator->errors()], 422);
            }
        
            // Step 2: Create the ClassTime
            $classTime = ClassTime::create($request->all());
        
            // Step 3: Retrieve all students associated with the classroom_id
            $students = DB::table('student_classes')
                ->where('classroom_id', $request->classroom_id)
                ->pluck('student_id');
        
            // Step 4: Create attendance records for each student
            foreach ($students as $studentId) {
                DB::table('attendances')->insert([
                    'student_id' => $studentId,
                    'class_time_id' => $classTime->id,
                    'attended' => false, // Default to false, can be updated later
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        
            return response()->json($classTime, 201);

        } catch (\Exception $e) {
            // Catch any exception and log the error
            Log::error('Error storing class time: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
        
            // Return a response with a generic error message
            return response()->json(['error' => 'An error occurred while creating the class time.'], 500);
        }
    }

    

    public function show($id)
    {
        $classTime = ClassTime::findOrFail($id);
        return response()->json($classTime);
    }

    public function update(Request $request, $id)
    {
        $validator = \Validator::make($request->all(), [
            'classroom_id' => 'required|exists:classrooms,id',
            'session_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);
    
        if ($validator->fails()) {
            \Log::error('Validation errors: ' . json_encode($validator->errors()));
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        $classTime = ClassTime::findOrFail($id);
        $classTime->update($request->all());
    
        return response()->json($classTime);
    }
    

    public function destroy($id)
    {
        $classTime = ClassTime::findOrFail($id);
        $classTime->delete();

        return response()->json(null, 204);
    }

    public function findByClassroomId($classroom_id)
{
    $classTimes = ClassTime::where('classroom_id', $classroom_id)->get();

    if ($classTimes->isEmpty()) {
        return response()->json([], 200);
    }

    return response()->json($classTimes);
}

public function filter(Request $request)
{
    // Validate the incoming query parameters
    $validated = $request->validate([
        'classroom_id' => 'required|exists:classrooms,id',
        'session_date' => 'required|date',
    ]);

    // Retrieve class times based on classroom_id and session_date
    $classTimes = ClassTime::where('classroom_id', $validated['classroom_id'])
                            ->whereDate('session_date', $validated['session_date'])
                            ->get();

    // Return the filtered class times
    return response()->json($classTimes);
}




}
