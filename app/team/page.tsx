import TeamView from "@/components/TeamView";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

export default function TeamPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardLayout>
        <div className="container mx-auto px-4 py-12">
          <TeamView />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
