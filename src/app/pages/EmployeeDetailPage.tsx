import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, Calendar, Building2, User, Loader2, CreditCard, FileText, MapPin, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { fetchEmployeeWithContract, Employee, Contract } from '../services/employeeService';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

interface EmployeeDetailPageProps {
  employeeId: string;
  onBack: () => void;
}

export function EmployeeDetailPage({ employeeId, onBack }: EmployeeDetailPageProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { employee, contract } = await fetchEmployeeWithContract(employeeId);
        setEmployee(employee);
        setContract(contract);
      } catch (err) {
        setError('Failed to load employee details.');
        console.error('Error loading employee:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployee();
  }, [employeeId]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
        <span className="mt-4 text-muted-foreground animate-pulse">Retrieving employee data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 mb-6">
          <h3 className="text-xl font-semibold text-destructive mb-2">Error Loading Profile</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button onClick={onBack} size="lg">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Dashboard
        </Button>
      </div>
    );
  }

  if (!employee) return null;

  const DetailItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | null | undefined }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-sm font-medium truncate">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 p-4 md:px-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">Employee Profile</h1>
          <p className="text-sm text-muted-foreground">Manage employee details</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Main Profile Card */}
          <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-card to-accent/10">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-8 flex flex-col items-center justify-center md:items-start md:w-80 border-b md:border-b-0 md:border-r border-border/50 bg-card/50">
                   <Avatar className="h-32 w-32 border-4 border-background shadow-xl mb-4">
                    <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                      {employee.fullName?.[0] || 'E'}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold text-center md:text-left">{employee.fullName}</h2>
                  <Badge variant="outline" className="mt-2 mb-4 bg-primary/5 text-primary border-primary/20">
                    {employee.specialization || 'Employee'}
                  </Badge>
                  <div className="w-full space-y-2">
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{employee.department}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{employee.address}</span>
                     </div>
                  </div>
                </div>
                
                <div className="flex-1 p-8">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Key Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DetailItem icon={Mail} label="Email" value={employee.email} />
                    <DetailItem icon={Phone} label="Phone" value={employee.phone} />
                    <DetailItem icon={Calendar} label="Start Date" value={new Date(employee.dateIn).toLocaleDateString()} />
                    <DetailItem icon={User} label="Gender" value={employee.gender} />
                    <DetailItem icon={User} label="Marital Status" value={employee.maritalStatus} />
                    <DetailItem icon={Calendar} label="Birthday" value={new Date(employee.birthday).toLocaleDateString()} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Contract & Status */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-sm border-border/60">
                <CardHeader className="border-b border-border/40 bg-accent/5">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Employment Contract
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                   {contract ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <DetailItem icon={FileText} label="Contract No" value={contract.contractNo} />
                         <DetailItem icon={Calendar} label="Start Date" value={new Date(contract.startDate).toLocaleDateString()} />
                      </div>
                      <div className="space-y-4">
                         <DetailItem icon={FileText} label="Type & Duration" value={`${contract.durationValue} ${contract.durationType}`} />
                         <DetailItem icon={Calendar} label="End Date" value={new Date(contract.endDate).toLocaleDateString()} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed border-border/50 rounded-lg">
                      <FileText className="h-12 w-12 mb-3 opacity-20" />
                      <p>No active contract found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border/60">
                 <CardHeader className="border-b border-border/40 bg-accent/5">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Professional & Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem icon={Briefcase} label="Specialization" value={employee.specialization} />
                      <DetailItem icon={Briefcase} label="Department" value={employee.department} />
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Financial & Other */}
            <div className="space-y-8">
              <Card className="h-full shadow-sm border-border/60">
                <CardHeader className="border-b border-border/40 bg-accent/5">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Financial & Legal
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-2">
                   <DetailItem icon={CreditCard} label="Bank Account" value={employee.bankAccount} />
                   <DetailItem icon={Building2} label="Bank Name" value={employee.bank} />
                   <DetailItem icon={FileText} label="SIN" value={employee.sin} />
                   <DetailItem icon={FileText} label="PTIN" value={employee.ptin} />
                   <DetailItem icon={CreditCard} label="National ID" value={employee.nationalId} />
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
