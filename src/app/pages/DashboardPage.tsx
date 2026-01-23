import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Building2, TrendingUp, UserCheck } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockEmployees, mockDepartments } from '../data/mockData';

export function DashboardPage() {
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(e => e.status === 'Active').length;
  const totalDepartments = mockDepartments.length;
  
  // Department distribution data
  const departmentData = mockDepartments.map(dept => ({
    name: dept.name,
    employees: dept.employeeCount
  }));

  // Status distribution data
  const statusData = [
    { name: 'Active', value: mockEmployees.filter(e => e.status === 'Active').length },
    { name: 'On Leave', value: mockEmployees.filter(e => e.status === 'On Leave').length },
    { name: 'Inactive', value: mockEmployees.filter(e => e.status === 'Inactive').length },
  ];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b'];

  const stats = [
    {
      title: 'Total Employees',
      value: totalEmployees.toString(),
      icon: Users,
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Active Employees',
      value: activeEmployees.toString(),
      icon: UserCheck,
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Departments',
      value: totalDepartments.toString(),
      icon: Building2,
      trend: '0%',
      trendUp: false
    },
    {
      title: 'Avg. Tenure',
      value: '2.3 yrs',
      icon: TrendingUp,
      trend: '+5%',
      trendUp: true
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your organization.
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
                    <p className={`text-sm ${stat.trendUp ? 'text-success' : 'text-muted-foreground'}`}>
                      {stat.trend} from last month
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
            <CardTitle>Employee Status Distribution</CardTitle>
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
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Sarah Johnson', action: 'completed onboarding', time: '2 hours ago' },
              { name: 'James Brown', action: 'joined Marketing department', time: '5 hours ago' },
              { name: 'Amanda White', action: 'requested leave', time: '1 day ago' },
              { name: 'David Martinez', action: 'updated profile', time: '2 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p><span className="font-medium">{activity.name}</span> {activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
