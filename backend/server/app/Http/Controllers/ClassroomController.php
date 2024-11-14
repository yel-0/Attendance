<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ClassroomController extends Controller
{
    /**
     * Create a new classroom.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'teacher_id' => 'required|exists:accounts,id',
        ]);

        $classroom = Classroom::create([
            'name' => $request->input('name'),
            'teacher_id' => $request->input('teacher_id'),
        ]);

        return response()->json($classroom, Response::HTTP_CREATED);
    }

    /**
     * Update an existing classroom.
     */
    public function update(Request $request, $id)
    {
        // Find the classroom by ID
        $classroom = Classroom::find($id);

        // Check if the classroom exists
        if (!$classroom) {
            return response()->json(['message' => 'Classroom not found'], 404);
        }

        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'teacher_id' => 'exists:accounts,id',
        ]);

        // Update the classroom
        $classroom->update($validated);

        // Return the updated classroom
        return response()->json($classroom);
    }

    /**
     * Delete a classroom.
     */
    public function destroy($id)
    {
        $classroom = Classroom::findOrFail($id);
        $classroom->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function index()
    {
        // Eager load the teacher relationship
        $classrooms = Classroom::with('teacher')->get();
    
        return response()->json($classrooms);
    }
    

    /**
     * Get classrooms by teacher (account) ID.
     */
    public function getClassroomsByTeacherId(Request $request)
    {
        $user = Auth::user(); // Get the authenticated user
        $teacherId = $user->id; // Get the teacher ID from the authenticated user

        $classrooms = Classroom::where('teacher_id', $teacherId)->get();

        return response()->json($classrooms);
    }

    public function getClassroomsByName($name)
{
    // Search for classrooms by name, using a case-insensitive search
    $classrooms = Classroom::where('name', 'LIKE', "%{$name}%")->with('teacher')->get();

    return response()->json($classrooms);
}
}
