import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { fetchAttendanceByCourse, markAttendance } from '../../../core/store/slices/attendanceSlice';
import { Card } from '../../../shared/components/Card/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Loader } from '../../../shared/components/Loader/Loader';
import { Toast } from '../../../shared/components/Toast/Toast';
import { formatDate } from '../../../core/utils/helpers';
import { Check, X, Clock } from 'lucide-react';

export const AttendanceSheet = () => {
  const dispatch = useAppDispatch();
  const { records, loading } = useAppSelector((state) => state.attendance);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchAttendanceByCourse({ courseId: selectedCourse, params: { date: selectedDate } }));
    }
  }, [dispatch, selectedCourse, selectedDate]);

  const handleMarkAttendance = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (!selectedCourse) return;
    await dispatch(markAttendance({
      courseId: selectedCourse,
      studentId,
      date: selectedDate,
      status,
    }));
    Toast.success(`Marked as ${status}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <Check className="h-5 w-5 text-green-600" />;
      case 'absent': return <X className="h-5 w-5 text-red-600" />;
      case 'late': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Sheet</h1>
        <p className="text-gray-600">Mark and manage attendance</p>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="rounded-lg border-gray-300"
            >
              <option value="">Select Course</option>
              <option value="course1">Mathematics 101</option>
              <option value="course2">Physics 101</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-2">
            {records.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No attendance records found</p>
            ) : (
              records.map((record: any) => (
                <div key={record._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium">
                      {record.studentId?.firstName?.[0]}{record.studentId?.lastName?.[0]}
                    </div>
                    <span className="font-medium">
                      {record.studentId?.firstName} {record.studentId?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={record.status === 'present' ? 'primary' : 'outline'}
                        onClick={() => handleMarkAttendance(record.studentId._id, 'present')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={record.status === 'absent' ? 'danger' : 'outline'}
                        onClick={() => handleMarkAttendance(record.studentId._id, 'absent')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={record.status === 'late' ? 'secondary' : 'outline'}
                        onClick={() => handleMarkAttendance(record.studentId._id, 'late')}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
