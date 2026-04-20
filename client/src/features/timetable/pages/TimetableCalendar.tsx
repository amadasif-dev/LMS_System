import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { fetchTimetable } from '../../../core/store/slices/timetableSlice';
import { Card } from '../../../shared/components/Card/Card';
import { Loader } from '../../../shared/components/Loader/Loader';
import { DAYS_OF_WEEK } from '../../../core/utils/constants';

export const TimetableCalendar = () => {
  const dispatch = useAppDispatch();
  const { entries, loading } = useAppSelector((state) => state.timetable);

  useEffect(() => {
    dispatch(fetchTimetable({}));
  }, [dispatch]);

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
        <p className="text-gray-600">Weekly class schedule</p>
      </div>

      <Card className="p-6 overflow-x-auto">
        {loading ? (
          <Loader />
        ) : (
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-2">
              <div className="font-semibold text-gray-500">Time</div>
              {DAYS_OF_WEEK.slice(0, 5).map((day) => (
                <div key={day} className="font-semibold text-gray-700 text-center">{day}</div>
              ))}

              {timeSlots.map((time) => (
                <>
                  <div key={time} className="text-sm text-gray-500 py-3">{time}</div>
                  {DAYS_OF_WEEK.slice(0, 5).map((day) => {
                    const entry = entries.find((e: any) =>
                      e.day === day && e.slots?.some((s: any) => s.startTime === time)
                    );
                    const slot = entry?.slots?.find((s: any) => s.startTime === time);

                    return (
                      <div key={`${day}-${time}`} className="border rounded p-2 min-h-[60px]">
                        {slot && (
                          <div className="bg-blue-50 rounded p-2 text-xs">
                            <p className="font-medium text-blue-900">{slot.subject}</p>
                            <p className="text-blue-700">{slot.room}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
