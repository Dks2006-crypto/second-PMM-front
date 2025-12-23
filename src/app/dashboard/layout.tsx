import DashboardWrapper from '@/components/DashboardWrapper';
import AuthGuard from '@/components/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardWrapper>
        {children}
      </DashboardWrapper>
    </AuthGuard>
  );
}