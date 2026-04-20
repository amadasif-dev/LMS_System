import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { fetchQuizzes } from '../../../core/store/slices/quizSlice';
import { Card } from '../../../shared/components/Card/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Table } from '../../../shared/components/Table/Table';
import { Loader } from '../../../shared/components/Loader/Loader';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { IQuiz } from '../../../core/api/types';

export const QuizList = () => {
  const dispatch = useAppDispatch();
  const { quizzes, loading, total } = useAppSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchQuizzes({ page: 1, limit: 10 }));
  }, [dispatch]);

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'duration', title: 'Duration', render: (row: IQuiz) => `${row.duration} min` },
    { key: 'totalMarks', title: 'Total Marks' },
    { key: 'passingMarks', title: 'Passing Marks' },
    { key: 'isPublished', title: 'Status', render: (row: IQuiz) => row.isPublished ? 'Published' : 'Draft' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-600">Manage quizzes and assessments</p>
        </div>
        <Link to="/quizzes/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Create Quiz
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
              data={quizzes}
            />
            <div className="mt-4 text-sm text-gray-600">
              Showing {quizzes.length} of {total} quizzes
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
