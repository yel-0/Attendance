<?php

use App\Http\Controllers\AccountController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\StudentClassController;
use App\Http\Controllers\ClassTimeController;
use App\Http\Middleware\JwtAuthenticate;
use App\Http\Controllers\AttendanceController;



Route::post('/register', [AccountController::class, 'register']);

Route::post('/login', [AccountController::class, 'login']);
Route::middleware(['auth:api', 'check.admin'])->get('/accounts', [AccountController::class, 'index']);
Route::middleware(['auth:api', 'check.admin'])->get('/accounts/role/{role}', [AccountController::class, 'getAccountsByRole']);
Route::middleware(['auth:api', 'check.admin'])->get('/accounts/students/{roleNumber}', [AccountController::class, 'findByRoleAndRoleNumber']);
Route::middleware(['auth:api', 'check.admin'])->put('/accounts/{id}', [AccountController::class, 'update']);
Route::middleware(['auth:api', 'check.admin'])->delete('/accounts/{id}', [AccountController::class, 'destroy']);
Route::get('/account/info', [AccountController::class, 'getUserInfo']);

Route::middleware(['auth:api', 'check.admin'])->group(function () {
    Route::post('/classrooms', [ClassroomController::class, 'store']);
    Route::put('/classrooms/{id}', [ClassroomController::class, 'update']);
    Route::delete('/classrooms/{id}', [ClassroomController::class, 'destroy']);
    Route::get('/classrooms', [ClassroomController::class, 'index']);
    Route::get('/classrooms/{id}', [ClassroomController::class, 'getClassRoomById']);
});
Route::middleware(['auth:api'])->get('/classrooms/teacher', [ClassroomController::class, 'getClassroomsByTeacherId']);
Route::middleware(['auth:api'])->get('/classrooms/name/{name}', [ClassroomController::class, 'getClassroomsByName']);




Route::middleware(['auth:api', 'check.admin'])->group(function () {
    // Create a new student-class association
    Route::post('/student-classes', [StudentClassController::class, 'store']);
    
    // Update an existing student-class association
    Route::put('/student-classes/{id}', [StudentClassController::class, 'update']);
    
    // Delete a student-class association
    Route::delete('/student-classes/{id}', [StudentClassController::class, 'destroy']);
});

// Public routes to get all student-class associations and specific ones by ID
Route::middleware('auth:api')->group(function () {
    // Get all student-class associations
    Route::get('/student-classes', [StudentClassController::class, 'index']);
    
    // Get a specific student-class association by ID
    Route::get('/student-classes/{id}', [StudentClassController::class, 'showByClassroomId']);

    Route::get('/classrooms/my-classrooms', [StudentClassController::class, 'getClassroomsByAuthStudent']);
});




Route::middleware('auth:api')->group(function () {
    // List all class times
    Route::get('/class-times', [ClassTimeController::class, 'index']);
    
    // Create a new class time
    Route::post('/class-times', [ClassTimeController::class, 'store']);
    
    // Update an existing class time
    Route::put('/class-times/{id}', [ClassTimeController::class, 'update']);
    
    Route::delete('/class-times/{id}', [ClassTimeController::class, 'destroy']);
    
    Route::get('/class-times/{id}', [ClassTimeController::class, 'show']);

    Route::get('/class-times/classroom/{classroom_id}', [ClassTimeController::class, 'findByClassroomId']);

    Route::get('/class-times/classroom/{classroom_id}/date/{session_date}', [ClassTimeController::class, 'findByClassroomIdAndSessionDate']);

});


Route::middleware('auth:api')->group(function () {
    // Route to fetch all attendances
    Route::get('/attendances', [AttendanceController::class, 'index']);
    
    // Route to create multiple attendances
    Route::post('/attendances', [AttendanceController::class, 'store']);
    
    // Route to fetch a specific attendance by ID
    Route::get('/attendances/{id}', [AttendanceController::class, 'show']);
    
    // Route to update a specific attendance by ID
    Route::put('/attendances', [AttendanceController::class, 'update']);
    
    // Route to delete a specific attendance by ID
    Route::delete('/attendances/{id}', [AttendanceController::class, 'destroy']);

    Route::post('attendances/by-class-times', [AttendanceController::class, 'getByClassTimes']);

    Route::post('/attendances/monthly', [AttendanceController::class, 'getAttendancesByMonth']);
    Route::post('/attendances-by-semester', [AttendanceController::class, 'getAttendancesByMonthRange']);
    Route::post('/attendances-by-month', [AttendanceController::class, 'getAuthUserAttendancesByMonth']);
    Route::post('/student/attendances/month-range', [AttendanceController::class, 'getStudentAttendancesByMonthRange']);


});