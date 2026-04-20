import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { fetchAssignments } from '../../../core/store/slices/assignmentSlice';
import { Card } from '../../../shared/components/Card/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Table } from '../../../shared/components/Table/Table';
import { Loader } from '../../../shared/components/Loader/Loader';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../core/utils/helpers';
import type { IAssignment } from '../../../core/api/types';

export const AssignmentList = () => {
  const dispatch = useAppDispatch();
  const { assignments, loading, total } = useAppSelector((state) => state.assignments);

  useEffect(() => {
    dispatch(fetchAssignments({ page: 1, limit: 10 }));
  }, [dispatch]);

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'dueDate', title: 'Due Date', render: (row: IAssignment) => formatDate(row.dueDate) },
    { key: 'maxMarks', title: 'Max Marks' },
    { key: 'submissions', title: 'Submissions', render: (row: IAssignment) => row.submissions?.length || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Manage assignments</p>
        </div>
        <Link to="/assignments/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Create Assignment
          </Button>
        </Link>
      </div>

      <Card>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Table
              columns={columns}
              data={assignments}
            />
            <div className="mt-4 text-sm text-gray-600">
              Showing {assignments.length} of {total} assignments
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
