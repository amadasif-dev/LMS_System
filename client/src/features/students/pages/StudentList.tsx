import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { fetchStudents, deleteStudent } from '../../../core/store/slices/studentSlice';
import { Card } from '../../../shared/components/Card/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Table } from '../../../shared/components/Table/Table';
import { Loader } from '../../../shared/components/Loader/Loader';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Toast } from '../../../shared/components/Toast/Toast';
import type { IUser } from '../../../core/api/types';

export const StudentList = () => {
  const dispatch = useAppDispatch();
  const { students, loading, total } = useAppSelector((state) => state.students);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchStudents({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      await dispatch(deleteStudent(id));
      Toast.success('Student deleted successfully');
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'name', title: 'Name', render: (row: IUser) => `${row.firstName} ${row.lastName}` },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role' },
    { key: 'isActive', title: 'Status', render: (row: IUser) => row.isActive ? 'Active' : 'Inactive' },
    { key: 'actions', title: 'Actions', render: (row: IUser) => (
      <button
        onClick={() => handleDelete(row._id)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage your students</p>
        </div>
        <Link to="/students/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Add Student
          </Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search students..."
            leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <Table
              columns={columns}
              data={filteredStudents}
            />
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredStudents.length} of {total} students
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
