<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 
        'class_time_id', 
        'attended', 
        'note'
    ];

    public function student()
    {
        return $this->belongsTo(Account::class, 'student_id');
    }

    public function classTime()
    {
        return $this->belongsTo(ClassTime::class, 'class_time_id');
    }
}
