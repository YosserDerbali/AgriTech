import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { StatsCard } from '@/components/admin/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStore } from '@/stores/adminStore';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import { useEffect } from 'react';
import type { Diagnosis } from '@/types/diagnosis';
import { 
  Users, 
  FileCheck, 
  Clock, 
  Brain,
  TrendingUp,
  Activity,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Generate weekly diagnosis data from backend diagnoses
const generateWeeklyData = (diagnoses: Diagnosis[]) => {
  const today = new Date();
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    const dayCount = diagnoses.filter((d) => {
      const dDate = new Date(d.createdAt);
      return dDate.toDateString() === date.toDateString();
    }).length;
    return {
      name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
      diagnoses: dayCount,
    };
  });
  return weekData;
};

export default function AdminDashboardPage() {
  const { getSystemStats, loadUsers } = useAdminStore();
  const { diagnoses } = useDiagnosisStore();

  const stats = getSystemStats();
  const pendingCount = diagnoses.filter((d) => d.status === 'PENDING').length;
  const approvedCount = diagnoses.filter((d) => d.status === 'APPROVED').length;

  // Generate data from backend diagnoses
  const diagnosisData = generateWeeklyData(diagnoses);
  const statusData = [
    { name: 'Approved', value: approvedCount, fill: 'hsl(var(--status-approved))' },
    { name: 'Pending', value: pendingCount, fill: 'hsl(var(--status-pending))' },
    { name: 'Rejected', value: diagnoses.filter((d) => d.status === 'REJECTED').length, fill: 'hsl(var(--status-rejected))' },
  ];

  // Fetch data on mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your smart agriculture platform</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              variant="primary"
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Total Diagnoses"
              value={stats.totalDiagnoses}
              icon={FileCheck}
              variant="success"
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Pending Review"
              value={pendingCount}
              icon={Clock}
              variant="warning"
            />
            <StatsCard
              title="AI Accuracy"
              value={`${stats.aiAccuracy}%`}
              icon={Brain}
              variant="accent"
              trend={{ value: 2.3, isPositive: true }}
            />
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-4 mb-8">
            {/* Diagnoses Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Weekly Diagnoses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    diagnoses: { label: 'Diagnoses', color: 'hsl(var(--primary))' },
                  }}
                  className="h-64"
                >
                  <AreaChart data={diagnosisData}>
                    <defs>
                      <linearGradient id="colorDiagnoses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="diagnoses"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorDiagnoses)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {statusData.map((status) => (
                    <div key={status.name} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.fill }}
                      />
                      <span>{status.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Farmers</p>
                    <p className="text-lg font-semibold">{stats.totalFarmers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Agronomists</p>
                    <p className="text-lg font-semibold">{stats.totalAgronomists}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <FileText className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Articles</p>
                    <p className="text-lg font-semibold">{stats.totalArticles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-status-approved/10">
                    <FileCheck className="w-5 h-5 text-status-approved" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-lg font-semibold">{approvedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
