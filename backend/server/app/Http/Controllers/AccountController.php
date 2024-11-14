<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Account;

class AccountController extends Controller
{
    public function register(Request $request)
    {
        // Validate
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:accounts',
            'password' => 'required|string|min:8|confirmed',
            'roleNumber' => 'nullable|string|unique:accounts,roleNumber', // Add this line
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        // Create the user
        $account = Account::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'student',  // Default role if not provided
            'roleNumber' => $request->roleNumber,
        ]);
    
        // Generate a token
        $token = JWTAuth::fromUser($account);
    
        return response()->json([
            'message' => 'Registration successful',
            'account' => $account,
            'token' => $token,
        ], 201);
    }
    

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $account = JWTAuth::user();

        return response()->json([
            'message' => 'Login successful',
            'account' => $account,
            'token' => $token,
        ]);
    }

    public function getUserInfo(Request $request)
{
    try {
        // Attempt to authenticate the user using the token in the header
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json([
            'message' => 'User information retrieved successfully',
            'user' => $user,
        ]);
    } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
        return response()->json(['error' => 'Token expired'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
        return response()->json(['error' => 'Token is invalid'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
        return response()->json(['error' => 'Token is absent'], 401);
    }
}


    public function index()
    {
        $accounts = Account::all();

        return response()->json([
            'accounts' => $accounts
        ]);
    }

    public function getAccountsByRole($role)
    {
        $accounts = Account::where('role', $role)->get();

        return response()->json([
            'accounts' => $accounts
        ]);
    }

    public function findByRoleAndRoleNumber($roleNumber)
{
    $accounts = Account::where('role', 'student')
                        ->where('roleNumber', 'like', '%' . $roleNumber . '%')
                        ->get();

    if ($accounts->isEmpty()) {
        return response()->json([], 200);
    }

    return response()->json($accounts, 200);
}

public function update(Request $request, $id)
{
    $account = Account::find($id);

    if (!$account) {
        return response()->json(['error' => 'Account not found'], 404);
    }

    // Validate
    $validator = Validator::make($request->all(), [
        'name' => 'sometimes|required|string|max:255',
        'email' => 'sometimes|required|string|email|max:255|unique:accounts,email,' . $id,
        'password' => 'sometimes|required|string|min:8|confirmed',
        'roleNumber' => 'nullable|string|unique:accounts,roleNumber,' . $id,
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    // Update account fields
    if ($request->has('name')) {
        $account->name = $request->name;
    }

    if ($request->has('email')) {
        $account->email = $request->email;
    }

    if ($request->has('password')) {
        $account->password = Hash::make($request->password);
    }

    if ($request->has('role')) {
        $account->role = $request->role;
    }

    if ($request->has('roleNumber')) {
        $account->roleNumber = $request->roleNumber;
    }

    $account->save();

    return response()->json([
        'message' => 'Account updated successfully',
        'account' => $account,
    ], 200);
}

public function destroy($id)
{
    $account = Account::find($id);

    if (!$account) {
        return response()->json(['error' => 'Account not found'], 404);
    }

    $account->delete();

    return response()->json([
        'message' => 'Account deleted successfully',
    ], 200);
}

}
