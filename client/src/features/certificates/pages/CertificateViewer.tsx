import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { fetchCertificates } from '../../../core/store/slices/certificateSlice';
import { Card } from '../../../shared/components/Card/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Loader } from '../../../shared/components/Loader/Loader';
import { Download, Award } from 'lucide-react';
import { formatDate } from '../../../core/utils/helpers';
import html2pdf from 'html2pdf.js';

export const CertificateViewer = () => {
  const dispatch = useAppDispatch();
  const { certificates, loading } = useAppSelector((state) => state.certificates);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchCertificates({}));
  }, [dispatch]);

  const downloadCertificate = (cert: any) => {
    if (certificateRef.current) {
      const opt = {
        margin: 0,
        filename: `certificate-${cert.certificateNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
      };
      html2pdf(certificateRef.current, opt);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-600">View and download your achievements</p>
      </div>

      {certificates.length === 0 ? (
        <Card className="p-12 text-center">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No certificates yet. Complete courses to earn certificates!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certificates.map((cert: any) => (
            <Card key={cert._id} className="p-6">
              <div ref={certificateRef} className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-4 border-yellow-400 p-8 rounded-lg text-center">
                <div className="mb-6">
                  <Award className="h-16 w-16 text-yellow-600 mx-auto" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h2>
                <p className="text-gray-600 mb-6">This is to certify that</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {cert.studentId?.firstName} {cert.studentId?.lastName}
                </p>
                <p className="text-gray-600 mb-6">has successfully completed</p>
                <p className="text-xl font-bold text-gray-900 mb-2">{cert.courseId?.title}</p>
                <p className="text-gray-500 text-sm">Certificate #{cert.certificateNumber}</p>
                <p className="text-gray-500 text-sm">Issued on {formatDate(cert.issuedDate)}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  leftIcon={<Download className="h-4 w-4" />}
                  onClick={() => downloadCertificate(cert)}
                >
                  Download PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
