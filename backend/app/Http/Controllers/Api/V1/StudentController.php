<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('class', 'ILIKE', "%{$search}%")
                    ->orWhere('nis', 'ILIKE', "%{$search}%");
            });
        }

        $perPage = (int) $request->query('per_page', 10);
        $perPage = in_array($perPage, [5, 10, 15, 25, 50]) ? $perPage : 10;
        $sortBy = $request->query('sort_by', 'created_at');
        $sortDir = $request->query('sort_dir', 'desc');

        $allowedSorts = ['created_at', 'name', 'nis', 'class', 'birth_date'];

        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        $sortDir = in_array(strtolower($sortDir), ['asc', 'desc']) ? $sortDir : 'desc';

        $students = $query->orderBy($sortBy, $sortDir)->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Data siswa berhasil diambil',
            'data' => $students
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nis' => ['required', 'string', 'unique:students,nis'],
            'name' => ['required', 'string', 'min:3'],
            'class' => ['required', 'string'],
            'gender' => ['required', 'in:L,P'],
            'birth_date' => ['required', 'date'],
            'address' => ['nullable', 'string']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $student = Student::create($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Siswa berhasil ditambahkan',
            'data' => $student
        ], 200);
    }

    public function show(Student $student)
    {
        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Siswa tidak ditemukan',
                'errors' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $student
        ], 200);
    }

    public function update(Request $request, Student $student)
    {
        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Siswa tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nis' => ['required', 'string', Rule::unique('students', 'nis')->ignore($student)],
            'name' => ['required', 'string', 'min:3'],
            'class' => ['required', 'string'],
            'gender' => ['required', 'in:L,P'],
            'birth_date' => ['required', 'date'],
            'address' => ['nullable', 'string']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validator gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $student->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Siswa berhasil diupdate',
            'data' => $student
        ], 200);
    }

    public function destroy(Student $student)
    {
        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Siswa tidak ditemukan',
            ], 404);
        }

        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Siswa berhasil dihapus',
            'data' => null
        ], 200);
    }
}
