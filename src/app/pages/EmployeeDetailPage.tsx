import { ArrowLeft, Mail, Phone, Calendar, DollarSign, Building2, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockEmployees } from '../data/mockData';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

interface EmployeeDetailPageProps {
  employeeId: string;
  onBack: () => void;
}

export function EmployeeDetailPage({ employeeId, onBack }: EmployeeDetailPageProps) {
  const employee = mockEmployees.find(e => e.id === employeeId);

  if (!employee) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>
        <p className="text-muted-foreground">Employee not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Employees
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {employee.firstName[0]}{employee.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h2>{employee.firstName} {employee.lastName}</h2>
                <p className="text-muted-foreground">{employee.position}</p>
                <Badge
                  variant={employee.status === 'Active' ? 'default' : 'secondary'}
                  className={
                    employee.status === 'Active'
                      ? 'bg-success/10 text-success hover:bg-success/20'
                      : employee.status === 'On Leave'
                      ? 'bg-warning/10 text-warning hover:bg-warning/20'
                      : ''
                  }
                >
                  {employee.status}
                </Badge>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{employee.department}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  Joined {new Date(employee.dateJoined).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              {employee.manager && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Reports to {employee.manager}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Employee ID</p>
                  <p>EMP-{employee.id.padStart(5, '0')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Position</p>
                  <p>{employee.position}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Department</p>
                  <p>{employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Employment Status</p>
                  <p>{employee.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                  <p>{new Date(employee.dateJoined).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tenure</p>
                  <p>
                    {Math.floor((new Date().getTime() - new Date(employee.dateJoined).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compensation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Salary</p>
                  <p className="text-2xl">
                    ${employee.salary.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance & History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p>Annual Review 2025</p>
                    <p className="text-sm text-muted-foreground">Completed on Dec 15, 2025</p>
                  </div>
                  <Badge className="bg-success/10 text-success hover:bg-success/20">Excellent</Badge>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p>Promotion</p>
                    <p className="text-sm text-muted-foreground">June 2024</p>
                  </div>
                  <Badge variant="secondary">Senior Level</Badge>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p>Training Completed</p>
                    <p className="text-sm text-muted-foreground">Leadership Course - March 2024</p>
                  </div>
                  <Badge variant="outline">Certificate</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
