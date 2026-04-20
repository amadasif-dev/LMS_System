import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { fetchTeachers, deleteTeacher } from '../../../core/store/slices/teacherSlice';
import { Card } from '../../../shared/components/Card/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Table } from '../../../shared/components/Table/Table';
import { Loader } from '../../../shared/components/Loader/Loader';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Toast } from '../../../shared/components/Toast/Toast';
import type { IUser } from '../../../core/api/types';

export const TeacherList = () => {
  const dispatch = useAppDispatch();
  const { teachers, loading, total } = useAppSelector((state) => state.teachers);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchTeachers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      await dispatch(deleteTeacher(id));
      Toast.success('Teacher deleted successfully');
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'name', title: 'Name', render: (row: IUser) => `${row.firstName} ${row.lastName}` },
    { key: 'email', title: 'Email' },
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
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600">Manage your teachers</p>
        </div>
        <Link to="/teachers/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Add Teacher
          </Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search teachers..."
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
              data={filteredTeachers}
            />
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredTeachers.length} of {total} teachers
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
