import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Building2, UserCheck, Loader2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEmployee } from '../hooks/useEmployee';

export function DashboardPage() {
  const { employees, loading } = useEmployee();


  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  const employeeList = employees || [];
  const activeEmployees = employeeList.filter(emp => emp.status !== 'Inactive');
  const totalEmployees = activeEmployees.length;
  
  // Calculate stats from real data (active only for department charts)
  const departmentCounts: Record<string, number> = {};
  activeEmployees.forEach(emp => {
    const dept = emp.departmentName || 'Chưa phân loại';
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });
  
  const departmentData = Object.entries(departmentCounts).map(([name, count]) => ({
    name,
    employees: count
  }));

  const totalDepartments = Object.keys(departmentCounts).length;

  const statusCounts: Record<string, number> = {};
  employeeList.forEach(emp => {
    const status = emp.status || 'Không xác định';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name, 
    value
  }));

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  const stats = [
    {
      title: 'Tổng số nhân viên',
      value: totalEmployees.toString(),
      icon: Users,
      trend: 'Đang làm việc',
    },
    {
      title: 'Phòng ban hoạt động',
      value: totalDepartments.toString(),
      icon: Building2,
      trend: 'Toàn tổ chức',
    },
    {
      title: 'Nhân viên đang làm việc',
      value: activeEmployees.filter(e => e.status === 'Active').length.toString(),
      icon: UserCheck,
      trend: 'Trạng thái Active',
    },
    {
      title: 'Quy mô nhóm TB',
      value: totalDepartments ? Math.round(totalEmployees / totalDepartments).toString() : '0',
      icon: Users,
      trend: 'Mỗi phòng ban',
    }
  ];

  const recentJoiners = [...employeeList]
    .sort((a, b) => new Date(b.dateJoined || 0).getTime() - new Date(a.dateJoined || 0).getTime())
    .slice(0, 5);


  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Thống kê</h1>
        <p className="text-muted-foreground">
          Tổng quan thời gian thực về tổ chức của bạn.
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
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nhân viên theo phòng ban</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 12)}...` : value}
                />
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

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <Card className="lg:col-span-6">
            <CardHeader>
              <CardTitle>Tỷ lệ nhân viên theo phòng ban</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="employees"
                  >
                    {departmentData.map((entry, index) => (
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

          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Phân bổ nhân viên theo trạng thái</CardTitle>
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
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Nhân viên mới nhất</CardTitle>
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
                      <p><span className="font-medium">{emp.firstName} {emp.lastName}</span> đã tham gia với vị trí {emp.specialization || 'Nhân viên'}</p>
                      <p className="text-sm text-muted-foreground">Đã tham gia {emp.dateJoined ? new Date(emp.dateJoined).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">Không có hoạt động gần đây.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
