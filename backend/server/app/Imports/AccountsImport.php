<?php

namespace App\Imports;

use App\Models\Account;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;

class AccountsImport implements ToModel
{
    public function model(array $row)
    {
        return new Account([
            'name' => $row[0], // Name column from Excel
            'email' => $row[1], // Email column from Excel
            'password' => Hash::make($row[2]), // Password column
            'role' => $row[3] ?? 'student', // Role column (optional, default to 'student')
            'roleNumber' => $row[4] ?? null, // RoleNumber column (optional)
        ]);
    }
}

