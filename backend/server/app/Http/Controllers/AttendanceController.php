<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    // Display a listing of the attendances.
    public function index()
    {
        $attendances = Attendance::with(['student', 'classTime'])->get();
        return response()->json($attendances);
    }

    // Store a newly created attendance in storage.
    
    
    public function store(Request $request)
    {
        Log::info('Received data:', $request->all());
        // Validate that the request is an array and each item in the array is properly structured
        $validatedData = $request->validate([
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:accounts,id',
            'attendances.*.class_time_id' => 'required|exists:class_times,id',
            'attendances.*.attended' => 'required|boolean',
            'attendances.*.note' => 'nullable|string',
        ]);
        
    
        // Start a database transaction
        DB::beginTransaction();
    
        try {
            // Create an empty array to hold the created attendance records
            $createdAttendances = [];
    
            // Iterate through the validated attendance data and create records
            foreach ($validatedData['attendances'] as $attendanceData) {
                $attendance = Attendance::create($attendanceData);
                $createdAttendances[] = $attendance;
            }
    
            // Commit the transaction if all records were created successfully
            DB::commit();
    
            // Return the created attendance records as a JSON response
            return response()->json($createdAttendances, 201);
    
        } catch (\Exception $e) {
            // Rollback the transaction if something went wrong
            DB::rollBack();
    
            // Log the error for debugging
            Log::error('Failed to create attendance records', ['error' => $e->getMessage()]);
    
            // Return an error response
            return response()->json(['error' => 'Failed to create attendance records'], 500);
        }
    }
    

    // Display the specified attendance.
    public function show($id)
    {
        $attendance = Attendance::with(['student', 'classTime'])->findOrFail($id);
        return response()->json($attendance);
    }

    // Update the specified attendance in storage.
    public function update(Request $request, $id = null)
    {
        // Log::info('Received data:', $request->all());
        
        // Validate that the request is an array and each item in the array is properly structured
        $validatedData = $request->validate([
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:accounts,id',
            'attendances.*.class_time_id' => 'required|exists:class_times,id',
            'attendances.*.attended' => 'required|boolean',
            'attendances.*.note' => 'nullable|string',
        ]);
    
        // Start a database transaction
        DB::beginTransaction();
    
        try {
            // Create an empty array to hold the updated attendance records
            $updatedAttendances = [];
    
            // Iterate through the validated attendance data and update records
            foreach ($validatedData['attendances'] as $attendanceData) {
                // Find the attendance record using student_id and class_time_id
                $attendance = Attendance::where('student_id', $attendanceData['student_id'])
                                         ->where('class_time_id', $attendanceData['class_time_id'])
                                         ->firstOrFail();
    
                $attendance->update($attendanceData);
                $updatedAttendances[] = $attendance;
            }
    
            // Commit the transaction if all records were updated successfully
            DB::commit();
    
            // Return the updated attendance records as a JSON response
            return response()->json($updatedAttendances, 200);
    
        } catch (\Exception $e) {
            // Rollback the transaction if something went wrong
            DB::rollBack();
    
            // Log the error for debugging
            Log::error('Failed to update attendance records', ['error' => $e->getMessage()]);
    
            // Return an error response
            return response()->json(['error' => 'Failed to update attendance records'], 500);
        }
    }
    
    

    // Remove the specified attendance from storage.
    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();

        return response()->json(null, 204);
    }

    public function getByClassTimes(Request $request)
{
    // Log the request data for debugging
    // \Log::info($request->all());

    // Validate the incoming request
    $validated = $request->validate([
        'class_time_ids' => 'required|array',
        'class_time_ids.*' => 'exists:class_times,id',
    ]);

    // Fetch attendance records that belong to the specified class_time_ids
    $attendances = Attendance::with(['student', 'classTime'])
        ->whereIn('class_time_id', $validated['class_time_ids'])
        ->get();
    return response()->json($attendances);
}


public function getAttendancesByMonth(Request $request)
{
    // Validate the incoming request
    $validated = $request->validate([
        'year' => 'required|integer|digits:4',
        'month' => 'required|integer|between:1,12',
        'classId' => 'required|integer|exists:classrooms,id',
    ]);

    $year = $validated['year'];
    $month = (int) $validated['month'];
    $classId = (int) $validated['classId'];

    // Get the number of days in the month
    $numDaysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);

    // Calculate the start and end dates for the given month
    $startDate = "{$year}-{$month}-01";
    $endDate = "{$year}-{$month}-{$numDaysInMonth}";

    // Fetch attendance records filtering by year, month, and classId
    $attendances = Attendance::with(['classTime' => function($query) {
            $query->select('id', 'classroom_id', 'session_date'); // Ensure necessary fields are selected
        }])
        ->whereHas('classTime', function ($query) use ($year, $month, $classId, $startDate, $endDate) {
            $query->whereYear('session_date', $year)
                ->whereMonth('session_date', $month)
                ->where('classroom_id', $classId);
        })
        ->get();

    // Calculate number of weeks (4 or 5 based on number of days)
    $numWeeks = $numDaysInMonth <= 28 ? 4 : ($numDaysInMonth <= 30 ? 5 : 5);

    // Define the week ranges dynamically
    $weekRanges = [];
    $startDay = 1;
    for ($i = 0; $i < $numWeeks; $i++) {
        $endDay = min($startDay + 6, $numDaysInMonth); // Each week is 7 days (or less for the last week)
        $weekRanges[] = ['start' => $startDay, 'end' => $endDay];
        $startDay = $endDay + 1;
    }

    // Group attendances by custom week ranges
    $attendancesByWeek = collect($weekRanges)->map(function ($weekRange, $index) use ($attendances, $year, $month) {
        // Get the start and end date of the current week range
        $startDate = Carbon::createFromFormat('Y-m-d', "{$year}-{$month}-{$weekRange['start']}")
                           ->startOfDay();
        $endDate = Carbon::createFromFormat('Y-m-d', "{$year}-{$month}-{$weekRange['end']}")
                         ->endOfDay();

        // Filter attendance records within this week range
        $weeklyAttendances = $attendances->filter(function ($attendance) use ($startDate, $endDate) {
            $attendanceDate = Carbon::parse($attendance->classTime->session_date);
            return $attendanceDate->between($startDate, $endDate);
        });

        // Group attendance records by student_id
        $studentsAttendance = $weeklyAttendances->groupBy('student_id')->map(function ($studentRecords) {
            $attendedCount = $studentRecords->where('attended', 1)->count(); // Count of attended records

            return [
                'student_id' => $studentRecords->first()->student_id, // Assuming each group has the same student_id
                'attended_count' => $attendedCount, // Include count of attended sessions
            ];
        });

        // Calculate total unique sessions using unique classTime IDs
        $uniqueClassTimeIds = $weeklyAttendances->pluck('class_time_id')->unique();

        return [
            'students' => $studentsAttendance, // Array of students with their details
            'total_sessions' => $uniqueClassTimeIds->count(), // Total unique sessions
        ];
    });

    // Calculate total sessions and total attendance for each student for the entire month
    $studentsMonthlyAttendance = $attendances->groupBy('student_id')->map(function ($studentRecords) use ($numWeeks) {
        // Count total attendance for the student in the entire month
        $totalAttended = $studentRecords->where('attended', 1)->count();

        // Count total unique sessions for the student in the entire month
        $uniqueClassTimeIds = $studentRecords->pluck('class_time_id')->unique();

        return [
            'total_attended' => $totalAttended, // Total attendance count for the whole month
            'total_sessions' => $uniqueClassTimeIds->count(), // Total unique sessions for the whole month
        ];
    });

    // Return the response in JSON format
    return response()->json([
        'attendances_by_week' => $attendancesByWeek,
        'monthly_summary' => $studentsMonthlyAttendance,
    ]);
}







public function getAttendancesByMonthRange(Request $request)
{
    // Validation remains the same
    $validated = $request->validate([
        'year' => 'required|integer',
        'startMonth' => 'required|integer|min:1|max:12',
        'endMonth' => 'required|integer|min:1|max:12',
        'classId' => 'required|integer|exists:classrooms,id',
    ]);

    $year = $validated['year'];
    $startMonth = (int) $validated['startMonth'];
    $endMonth = (int) $validated['endMonth'];
    $classId = (int) $validated['classId'];

    // Fetch attendances filtering by year, startMonth, endMonth, and classId
    $attendances = Attendance::with(['classTime' => function($query) {
            $query->select('id', 'classroom_id', 'session_date'); // Ensure necessary fields are selected
        }])
        ->whereHas('classTime', function ($query) use ($year, $startMonth, $endMonth, $classId) {
            $query->whereYear('session_date', $year)
                ->whereMonth('session_date', '>=', $startMonth)
                ->whereMonth('session_date', '<=', $endMonth)
                ->where('classroom_id', $classId);
        })
        ->get();

    // Group attendances by month
    $attendancesByMonth = $attendances->groupBy(function ($attendance) {
        return Carbon::parse($attendance->classTime->session_date)->format('F');
    })->map(function ($attendanceRecords) {
        // Group attendance records by student_id
        $studentsAttendance = $attendanceRecords->groupBy('student_id')->map(function ($studentRecords) {
            $attendedCount = $studentRecords->where('attended', 1)->count(); // Count of attended records

            return [
                'student_id' => $studentRecords->first()->student_id, // Assuming each group has the same student_id
                'attended_count' => $attendedCount, // Include count of attended sessions
            ];
        });

        // Calculate total unique sessions using unique classTime IDs
        $uniqueClassTimeIds = $attendanceRecords->pluck('class_time_id')->unique();

        return [
            'students' => $studentsAttendance, // Array of students with their details
            // 'total_students' => $studentsAttendance->count(), // Count of unique students for the month
            'total_sessions' => $uniqueClassTimeIds->count(), // Total unique sessions
            // 'records' => $attendanceRecords, // All raw records for the month
        ];
    });


    // Return the response in JSON format
    return response()->json($attendancesByMonth);
}

public function getAuthUserAttendancesByMonth(Request $request)
    {
        // Validation
        $validated = $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer|min:1|max:12',
            'classId' => 'required|integer|exists:classrooms,id',
        ]);

        $year = $validated['year'];
        $month = (int) $validated['month'];
        $classId = (int) $validated['classId'];

        // Get the authenticated user
        $user = Auth::user();
        $studentId = $user->id;

        Log::info('Attendance Request:', [
            'year' => $year,
            'month' => $month,
            'classId' => $classId,
            'studentId' => $studentId,
        ]);

        // Fetch attendances filtering by year, month, classId, and studentId
        $attendances = Attendance::with(['classTime' => function($query) {
            $query->select('id', 'classroom_id', 'session_date'); // Ensure necessary fields are selected
        }])
        ->whereHas('classTime', function ($query) use ($year, $month, $classId) {
            $query->whereYear('session_date', $year)
                ->whereMonth('session_date', $month)
                ->where('classroom_id', $classId);
        })
        ->where('student_id', $studentId)
        ->get();
        
        
        return response()->json($attendances);
    }

    public function getStudentAttendancesByMonthRange(Request $request)
    {
        // Validation remains the same
        $validated = $request->validate([
            'year' => 'required|integer',
            'startMonth' => 'required|integer|min:1|max:12',
            'endMonth' => 'required|integer|min:1|max:12',
            'classId' => 'required|integer|exists:classrooms,id',
        ]);

        // Get the currently authenticated user
        $user = Auth::user();
        $studentId = $user->id; // Get the student ID from the authenticated user

        $year = $validated['year'];
        $startMonth = (int) $validated['startMonth'];
        $endMonth = (int) $validated['endMonth'];
        $classId = (int) $validated['classId'];

        // Fetch attendances filtering by year, startMonth, endMonth, classId, and studentId
        $attendances = Attendance::with(['classTime' => function ($query) {
                $query->select('id', 'classroom_id', 'session_date'); // Ensure necessary fields are selected
            }])
            ->whereHas('classTime', function ($query) use ($year, $startMonth, $endMonth, $classId) {
                $query->whereYear('session_date', $year)
                    ->whereMonth('session_date', '>=', $startMonth)
                    ->whereMonth('session_date', '<=', $endMonth)
                    ->where('classroom_id', $classId);
            })
            ->where('student_id', $studentId) // Filter by the specific student
            ->get();

        // Group attendances by month
        $attendancesByMonth = $attendances->groupBy(function ($attendance) {
            return Carbon::parse($attendance->classTime->session_date)->format('F');
        })->map(function ($attendanceRecords) {
            $attendedCount = $attendanceRecords->where('attended', 1)->count(); // Count of attended records

            // Calculate total unique sessions using unique classTime IDs
            $uniqueClassTimeIds = $attendanceRecords->pluck('class_time_id')->unique();

            return [
                'attended_count' => $attendedCount, // Include count of attended sessions
                'total_sessions' => $uniqueClassTimeIds->count(), // Total unique sessions
            ];
        });

        // Return the response in JSON format
        return response()->json($attendancesByMonth);
    }
}
