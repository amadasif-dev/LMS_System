import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { fetchCourses } from '../../../core/store/slices/courseSlice';
import { Card } from '../../../shared/components/Card/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Table } from '../../../shared/components/Table/Table';
import { Loader } from '../../../shared/components/Loader/Loader';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ICourse } from '../../../core/api/types';

export const CourseList = () => {
  const dispatch = useAppDispatch();
  const { courses, loading, total } = useAppSelector((state) => state.courses);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, limit: 10 }));
  }, [dispatch]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'category', title: 'Category' },
    { key: 'level', title: 'Level' },
    { key: 'instructor', title: 'Instructor', render: (row: ICourse) => 
      typeof row.instructor === 'object' ? row.instructor?.firstName : row.instructor 
    },
    { key: 'isPublished', title: 'Status', render: (row: ICourse) => 
      row.isPublished ? 'Published' : 'Draft' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">Manage your courses</p>
        </div>
        <Link to="/courses/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Create Course
          </Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search courses..."
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
              data={filteredCourses}
              onRowClick={(row) => console.log('Clicked', row)}
            />
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredCourses.length} of {total} courses
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
