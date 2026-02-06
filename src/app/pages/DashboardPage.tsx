import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Building2, TrendingUp, UserCheck, Loader2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchEmployees, Employee } from '../services/employeeService';

export function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (err) {
        console.error('Error loading employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => !e.dateIn).length; // Assuming no separate status field, or map DateIn logic? Wait, ApiEmployee doesn't have status. Let's assume all are active for now or check logic.
  // Actually, checking the Employee interface, there is no 'status' field. 
  // The original code used `e.status === 'Active'` which implies the interface might have had it or it was assumed. 
  // Let's re-examine Employee interface in previous turns. 
  // ... It does NOT have status. 
  // I will assume for now that all employees fetched are "Active" unless we have a way to determine. 
  // Or I can calculate "New Joiners" based on DateIn.
  
  // Let's implement dynamic Department Data
  const departmentCounts: Record<string, number> = {};
  employees.forEach(emp => {
    const dept = emp.department || 'Unassigned';
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  const departmentData = Object.entries(departmentCounts).map(([name, count]) => ({
    name,
    employees: count
  }));

  const totalDepartments = Object.keys(departmentCounts).length;

  // Status Distribution - Since we don't have a status field, let's mock this part or remove it.
  // Or better, let's derive it from something else if possible. 
  // If no status, maybe we can't show "Active/Inactive". 
  // Let's show "Gender Distribution" instead as it is available? Or just keep it simple.
  // The user want to remove hardcoded data. 
  // I will change "Employee Status Distribution" to "Gender Distribution" as it is real data.
  const genderCounts: Record<string, number> = {};
  employees.forEach(emp => {
    const gender = emp.gender || 'Unknown';
    genderCounts[gender] = (genderCounts[gender] || 0) + 1;
  });
  
  const statusData = Object.entries(genderCounts).map(([name, value]) => ({
    name, 
    value
  }));

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  const stats = [
    {
      title: 'Total Employees',
      value: totalEmployees.toString(),
      icon: Users,
      trend: 'Total Count',
      trendUp: true
    },
    {
      title: 'Active Departments',
      value: totalDepartments.toString(),
      icon: Building2,
      trend: 'Across Org',
      trendUp: true
    },
    {
      title: 'New Joiners (This Month)',
      value: employees.filter(e => {
        if (!e.dateIn) return false;
        const date = new Date(e.dateIn);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length.toString(),
      icon: UserCheck,
      trend: 'Growth',
      trendUp: true
    },
    {
      title: 'Avg. Team Size',
      value: totalDepartments ? Math.round(totalEmployees / totalDepartments).toString() : '0',
      icon: Users,
      trend: 'Per Dept',
      trendUp: true
    }
  ];

  // Recent Activity - Derived from latest DateIn
  // Sort employees by dateIn descending
  const recentJoiners = [...employees]
    .sort((a, b) => new Date(b.dateIn).getTime() - new Date(a.dateIn).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time overview of your organization.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.trend}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="employees" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Newest Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentJoiners.length > 0 ? (
              recentJoiners.map((emp, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p><span className="font-medium">{emp.fullName}</span> joined as {emp.specialization || 'Employee'}</p>
                      <p className="text-sm text-muted-foreground">Joined {new Date(emp.dateIn).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No recent activity.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
