import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Employee } from '../data/mockData';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  User, 
  Building2, 
  Cake, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  Wallet,
  Landmark,
  Heart,
  Trophy,
  Users,
  Calendar,
  FileText,
  Briefcase,
  Save,
  X
} from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (employee: Employee) => void;
  mode?: 'view' | 'add';
}

export function EmployeeDetailModal({ 
  employee, 
  open, 
  onOpenChange, 
  onSave,
  mode: initialMode = 'view'
}: EmployeeDetailModalProps) {
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else if (initialMode === 'add') {
      // Initialize with default values for new employee
      setFormData({
        firstName: '',
        lastName: '',
        gender: 'Other',
        birthday: '',
        nationalId: '',
        address: '',
        email: '',
        phone: '',
        zaloNumber: '',
        position: '',
        department: '',
        accountNo: '',
        bankAccount: '',
        bank: '',
        sin: '',
        ptin: '',
        hobby: '',
        favoriteSport: '',
        maritalStatus: 'Single',
        contractStartDate: '',
        contractEndDate: '',
        contractDuration: '',
        specialization: '',
        status: 'Active',
        dateJoined: new Date().toISOString().split('T')[0],
        salary: 0,
      });
    }
  }, [employee, open, initialMode]);

  const handleSave = () => {
    if (onSave && formData.firstName && formData.lastName && formData.email) {
      onSave(formData as Employee);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const InfoField = ({ 
    icon: Icon, 
    label, 
    field, 
    type = 'text',
    options 
  }: { 
    icon: any; 
    label: string; 
    field: keyof Employee;
    type?: 'text' | 'date' | 'select' | 'email' | 'number';
    options?: { value: string; label: string }[];
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        {type === 'select' && options ? (
          <Select
            value={formData[field]?.toString() || ''}
            onValueChange={(value) => setFormData({ ...formData, [field]: value })}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type={type}
            value={formData[field]?.toString() || ''}
            onChange={(e) => setFormData({ ...formData, [field]: type === 'number' ? Number(e.target.value) : e.target.value })}
            className="h-9"
          />
        )}
      </div>
    </div>
  );

  if (!open) return null;

  const displayData = formData as Employee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[80vw] !max-w-[80vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialMode === 'add' ? 'Add New Employee' : 'Employee Details'}
          </DialogTitle>
        </DialogHeader>

        {/* Profile Header */}
        <div className="flex items-center gap-6 p-6 bg-accent/50 rounded-lg">
          <Avatar className="h-40 w-30 rounded-lg">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl rounded-lg">
              {displayData.firstName?.[0] || 'N'}{displayData.lastName?.[0] || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">First Name</Label>
                  <Input
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="h-9"
                    placeholder="First Name"
                    autoFocus={false}
                  />
                </div>
                <div>
                  <Label className="text-xs">Last Name</Label>
                  <Input
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-9"
                    placeholder="Last Name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Position</Label>
                  <Input
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="h-9"
                    placeholder="Position"
                  />
                </div>
                <div>
                  <Label className="text-xs">Department</Label>
                  <Select
                    value={formData.department || ''}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border">Personal Information</h3>
            <InfoField 
              icon={User} 
              label="Gender" 
              field="gender"
              type="select"
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
            />
            <InfoField 
              icon={Cake} 
              label="Birthday" 
              field="birthday"
              type="date"
            />
            <InfoField 
              icon={CreditCard} 
              label="National ID" 
              field="nationalId"
            />
            <InfoField 
              icon={MapPin} 
              label="Address" 
              field="address"
            />
            <InfoField 
              icon={Users} 
              label="Marital Status" 
              field="maritalStatus"
              type="select"
              options={[
                { value: 'Single', label: 'Single' },
                { value: 'Married', label: 'Married' },
                { value: 'Divorced', label: 'Divorced' },
                { value: 'Widowed', label: 'Widowed' }
              ]}
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border">Contact Information</h3>
            <InfoField 
              icon={Phone} 
              label="Phone Number" 
              field="phone"
            />
            <InfoField 
              icon={MessageCircle} 
              label="Zalo Number" 
              field="zaloNumber"
            />
            <InfoField 
              icon={Mail} 
              label="Email" 
              field="email"
              type="email"
            />
          </div>

          {/* Financial Information */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border">Financial Information</h3>
            <InfoField 
              icon={CreditCard} 
              label="SIN" 
              field="sin"
            />
            <InfoField 
              icon={Wallet} 
              label="Bank Account" 
              field="bankAccount"
            />
            <InfoField 
              icon={Landmark} 
              label="Bank" 
              field="bank"
            />
            <InfoField 
              icon={FileText} 
              label="PTIN" 
              field="ptin"
            />
          </div>

          {/* Personal Interests */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border">Personal Interests</h3>
            <InfoField 
              icon={Heart} 
              label="Hobby" 
              field="hobby"
            />
            <InfoField 
              icon={Trophy} 
              label="Favorite Sport" 
              field="favoriteSport"
            />
          </div>

          {/* Employment Details */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border">Employment Details</h3>
            <InfoField 
              icon={Calendar} 
              label="Date In" 
              field="dateJoined"
              type="date"
            />
            <InfoField 
              icon={FileText} 
              label="Contract Duration" 
              field="contractDuration"
            />
            <InfoField 
              icon={Calendar} 
              label="Contract Start" 
              field="contractStartDate"
              type="date"
            />
            <InfoField 
              icon={Calendar} 
              label="Contract End" 
              field="contractEndDate"
              type="date"
            />
            <InfoField 
              icon={Briefcase} 
              label="Specialization" 
              field="specialization"
            />
          </div>

          {/* Additional Fields */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border">Additional Information</h3>
            <InfoField 
              icon={FileText} 
              label="Contract No" 
              field="contractNo"
            />
            <InfoField 
              icon={CreditCard} 
              label="Account No" 
              field="accountNo"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {initialMode === 'add' ? 'Add Employee' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}