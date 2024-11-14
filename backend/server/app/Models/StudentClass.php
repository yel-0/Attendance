<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentClass extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'classroom_id',
    ];

    /**
     * Get the student associated with the student_class.
     */
    public function student()
    {
        return $this->belongsTo(Account::class, 'student_id');
    }

    /**
     * Get the classroom associated with the student_class.
     */
    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
    }
}
