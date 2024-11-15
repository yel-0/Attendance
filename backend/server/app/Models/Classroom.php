<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'teacher_id',
        'subject',  
        'session',  
    ];

    /**
     * Get the teacher associated with the classroom.
     */
    public function teacher()
    {
        return $this->belongsTo(Account::class, 'teacher_id');
    }
}
