import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { fetchPayments } from '../../../core/store/slices/paymentSlice';
import { Card } from '../../../shared/components/Card/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Table } from '../../../shared/components/Table/Table';
import { Loader } from '../../../shared/components/Loader/Loader';
import { Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../core/utils/helpers';
import type { IPayment } from '../../../core/api/types';

export const PaymentList = () => {
  const dispatch = useAppDispatch();
  const { payments, loading, total } = useAppSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPayments({ page: 1, limit: 10 }));
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'overdue': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const columns = [
    { key: 'invoiceNumber', title: 'Invoice #' },
    { key: 'student', title: 'Student', render: (row: IPayment) => 
      typeof row.studentId === 'object' ? `${row.studentId?.firstName} ${row.studentId?.lastName}` : row.studentId 
    },
    { key: 'amount', title: 'Amount', render: (row: IPayment) => formatCurrency(row.amount, row.currency) },
    { key: 'status', title: 'Status', render: (row: IPayment) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
        {row.status}
      </span>
    )},
    { key: 'createdAt', title: 'Date', render: (row: IPayment) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Manage fee payments and invoices</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Create Invoice
        </Button>
      </div>

      <Card>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Table
              columns={columns}
              data={payments}
            />
            <div className="mt-4 text-sm text-gray-600">
              Showing {payments.length} of {total} payments
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
