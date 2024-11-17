<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;


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
            'subject' => 'required|string|max:255',  // Validate subject field
            'session' => 'required|string|max:50',  // Validate session field with limited options
        ]);
    
        $classroom = Classroom::create([
            'name' => $request->input('name'),
            'teacher_id' => $request->input('teacher_id'),
            'subject' => $request->input('subject'),  // Add subject field
            'session' => $request->input('session'),  // Add session field
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
            'subject' => 'required|string|max:255', // Added subject field validation
            'session' => 'required|string|max:50',  // Added session field validation
        ]);
    
        // Update the classroom
        $classroom->update($validated);
    
        // Return the updated classroom
        return response()->json([
            'message' => 'Classroom updated successfully',
            'classroom' => $classroom
        ]);
    }
    
    public function getClassRoomById($id)
    {
        // Find the classroom by ID, including the teacher's details
        $classroom = Classroom::with('teacher')->find($id);
    
        // Check if the classroom exists
        if (!$classroom) {
            return response()->json(['message' => 'Classroom not found'], 404);
        }
    
        // Return the classroom details with teacher information
        return response()->json([
            'classroom' => $classroom,
            'teacher' => $classroom->teacher, // Include the teacher's info
        ]);
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

    public function index(Request $request)
    {
        // Get the 'name' and 'session' query parameters
        $name = $request->query('name');
        $session = $request->query('session');
        
        // Build the query with optional filtering
        $query = Classroom::with('teacher');
        
        // Filter by name if provided
        if ($name) {
            $query->where('name', 'like', '%' . $name . '%');
        }
        
        // Filter by session if provided
        if ($session) {
            $query->where('session', $session);
        }
        
        $classrooms = $query->get(); // Execute the query
        
        return response()->json($classrooms);
    }
    
    

    /**
     * Get classrooms by teacher (account) ID.
     */
    public function getClassroomsByTeacherId(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
    
            $teacherId = $user->id; // Get the teacher ID from the authenticated user
    
            $classrooms = Classroom::where('teacher_id', $teacherId)->get();
    
            return response()->json($classrooms);
        } catch (\Exception $e) {
            // Log the error with additional context
            Log::error('Error fetching classrooms', [
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
                'user_id' => Auth::id() ?? 'Not Authenticated',
            ]);
    
            // Return a generic error response
            return response()->json(['error' => 'An error occurred while fetching classrooms'], 500);
        }
    }

    public function getClassroomsByName($name)
{
    // Search for classrooms by name, using a case-insensitive search
    $classrooms = Classroom::where('name', 'LIKE', "%{$name}%")->with('teacher')->get();

    return response()->json($classrooms);
}
}
