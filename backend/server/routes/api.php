<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\StudentClassController;
use App\Http\Controllers\ClassTimeController;
use App\Http\Middleware\JwtAuthenticate;
use App\Http\Controllers\AttendanceController;
use Illuminate\Support\Facades\Route;



Route::post('/login', [AccountController::class, 'login']);
Route::get('/account/info', [AccountController::class, 'getUserInfo']);


Route::middleware(['auth:api', 'check.admin'])->group(function () {
    // List all accounts
    Route::get('/accounts', [AccountController::class, 'index']);
    
    // Register Users with excel file
    Route::post('/upload-excel', [AccountController::class, 'uploadExcel']);

    // Register User
    Route::post('/register', [AccountController::class, 'register']);
 
    // Get accounts by role
    Route::get('/accounts/role/{role}', [AccountController::class, 'getAccountsByRole']);
    
    // Find accounts by student role and role number
    Route::get('/accounts/students/{roleNumber}', [AccountController::class, 'findByRoleAndRoleNumber']);
    
    // Update an account
    Route::put('/accounts/{id}', [AccountController::class, 'update']);
    
    // Filter teachers by name
    Route::get('/accounts/teachers/filter', [AccountController::class, 'filterTeachersByName']);
    
    // Delete an account
    Route::delete('/accounts/{id}', [AccountController::class, 'destroy']);
});



Route::middleware(['auth:api', 'check.admin'])->group(function () {
    // Create a new classroom
    Route::post('/classrooms', [ClassroomController::class, 'store']);
    
    // Update an existing classroom by ID
    Route::put('/classrooms/{id}', [ClassroomController::class, 'update']);
    
    // Delete a classroom by ID
    Route::delete('/classrooms/{id}', [ClassroomController::class, 'destroy']);
    
    // Get a list of all classrooms
    Route::get('/classrooms', [ClassroomController::class, 'index']);
    
    // Get a specific classroom by ID
    Route::get('/classrooms/{id}', [ClassroomController::class, 'getClassRoomById']);
});

Route::middleware(['auth:api'])->group(function () {
    // Get classrooms by teacher ID
    Route::get('/teacher/classrooms', [ClassroomController::class, 'getClassroomsByTeacherId']);

    // Get classrooms by name
    Route::get('/classrooms/name/{name}', [ClassroomController::class, 'getClassroomsByName']);
});





Route::middleware(['auth:api', 'check.admin'])->group(function () {

    // Create a new student-class association
    Route::post('/student-classes', [StudentClassController::class, 'store']); 

    // Update an existing student-class association by ID
    Route::put('/student-classes/{id}', [StudentClassController::class, 'update']); 

    // Delete a student-class association by ID
    Route::delete('/student-classes/{id}', [StudentClassController::class, 'destroy']); 

    // Import student-class associations from an Excel file
    Route::post('/import-student-classes', [StudentClassController::class, 'importExcel']); 
});

// Publicly accessible routes for viewing student-class associations
Route::middleware('auth:api')->group(function () {

    // Retrieve all student-class associations
    Route::get('/student-classes', [StudentClassController::class, 'index']); 

    // Retrieve student-class associations for a specific classroom by classroom ID
    Route::get('/student-classes/{id}', [StudentClassController::class, 'showByClassroomId']); 

    // Retrieve classrooms associated with the currently authenticated student
    Route::get('/my-classrooms/classrooms', [StudentClassController::class, 'getClassroomsByAuthStudent']); 
});




Route::middleware('auth:api')->group(function () {

    // List all class times (supports optional filtering via query parameters).
    Route::get('/class-times', [ClassTimeController::class, 'index']);

    // Create a new class time.
    Route::post('/create/class-times', [ClassTimeController::class, 'store']);

    // Retrieve a specific class time by ID.
    Route::get('/class-times/{id}', [ClassTimeController::class, 'show']);

    // Update a specific class time by ID.
    Route::put('/class-times/{id}', [ClassTimeController::class, 'update']);

    // Delete a specific class time by ID.
    Route::delete('/class-times/{id}', [ClassTimeController::class, 'destroy']);

    // Retrieve class times filtered by classroom ID and optional session date via query parameters.
    Route::get('/filter/class-times', [ClassTimeController::class, 'filter']);
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