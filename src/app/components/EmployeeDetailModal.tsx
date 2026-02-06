import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Employee, Contract } from '../services/employeeService';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
  X,
  Loader2,
  Camera
} from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  contract?: Contract | null;
  isLoading?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (employee: Employee, imageFile?: File) => void;
  mode?: 'view' | 'add';
}

const InfoField = ({ 
  icon: Icon, 
  label, 
  field, 
  type = 'text',
  formData,
  setFormData
}: { 
  icon: any; 
  label: string; 
  field: keyof Employee;
  type?: 'text' | 'date' | 'email' | 'number';
  formData: Partial<Employee>;
  setFormData: (data: Partial<Employee>) => void;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <Input
        type={type}
        value={formData[field]?.toString() || ''}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        className="h-9"
      />
    </div>
  </div>
);

export function EmployeeDetailModal({ 
  employee, 
  contract,
  isLoading = false,
  open, 
  onOpenChange, 
  onSave,
  mode: initialMode = 'view'
}: EmployeeDetailModalProps) {
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      setImagePreview(employee.image || null); // Assuming employee.image is a URL or base64 string
    } else if (initialMode === 'add') {
      // Initialize with default values for new employee
      setFormData({
        id: '',
        fullName: '',
        gender: '',
        birthday: '',
        department: '',
        bankAccount: '',
        bank: '',
        sin: '',
        ptin: '',
        nationalId: '',
        address: '',
        phone: '',
        zaloNo: '',
        email: '',
        hobby: '',
        favoriteSport: '',
        maritalStatus: '',
        dateIn: new Date().toISOString().split('T')[0],
        specialization: '',
        // Initialize contract fields
        contractNo: '',
        durationValue: '',
        durationType: 'Month',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [employee, open, initialMode]);

  const handleSave = () => {
    if (onSave && formData.fullName && formData.email) {
      onSave(formData as Employee, imageFile || undefined);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <div className="relative group cursor-pointer" onClick={handleImageClick}>
            <Avatar className="h-40 w-30 rounded-lg border-4 border-background shadow-sm transition-opacity group-hover:opacity-80">
              {imagePreview ? (
                <AvatarImage src={imagePreview} className="object-cover" />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl rounded-lg">
                {displayData.fullName?.[0] || 'N'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <Camera className="h-8 w-8" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex-1">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Full Name</Label>
                <Input
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-9"
                  placeholder="Full Name"
                  autoFocus={false}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Specialization</Label>
                  <Input
                    value={formData.specialization || ''}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="h-9"
                    placeholder="Specialization"
                  />
                </div>
                <div>
                  <Label className="text-xs">Department</Label>
                  <Input
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="h-9"
                    placeholder="Department"
                  />
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
            <InfoField icon={FileText} label="Employee ID" field="id" formData={formData} setFormData={setFormData} />
            <InfoField icon={User} label="Gender" field="gender" formData={formData} setFormData={setFormData} />
            <InfoField icon={Cake} label="Birthday" field="birthday" type="date" formData={formData} setFormData={setFormData} />
            <InfoField icon={CreditCard} label="National ID" field="nationalId" formData={formData} setFormData={setFormData} />
            <InfoField icon={MapPin} label="Address" field="address" formData={formData} setFormData={setFormData} />
            <InfoField icon={Users} label="Marital Status" field="maritalStatus" formData={formData} setFormData={setFormData} />
          </div>

          {/* Contact Information */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border">Contact Information</h3>
            <InfoField icon={Phone} label="Phone Number" field="phone" formData={formData} setFormData={setFormData} />
            <InfoField icon={MessageCircle} label="Zalo Number" field="zaloNo" formData={formData} setFormData={setFormData} />
            <InfoField icon={Mail} label="Email" field="email" type="email" formData={formData} setFormData={setFormData} />
          </div>

          {/* Financial Information */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border">Financial Information</h3>
            <InfoField icon={CreditCard} label="SIN" field="sin" formData={formData} setFormData={setFormData} />
            <InfoField icon={Wallet} label="Bank Account" field="bankAccount" formData={formData} setFormData={setFormData} />
            <InfoField icon={Landmark} label="Bank" field="bank" formData={formData} setFormData={setFormData} />
            <InfoField icon={FileText} label="PTIN" field="ptin" formData={formData} setFormData={setFormData} />
          </div>

          {/* Personal Interests */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border">Personal Interests</h3>
            <InfoField icon={Heart} label="Hobby" field="hobby" formData={formData} setFormData={setFormData} />
            <InfoField icon={Trophy} label="Favorite Sport" field="favoriteSport" formData={formData} setFormData={setFormData} />
          </div>

          {/* Employment Details */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border">Employment Details</h3>
            <InfoField 
              icon={Calendar} 
              label="Date In" 
              field="dateIn"
              type="date"
              formData={formData}
              setFormData={setFormData}
            />
            {/* Show inputs if adding new employee, otherwise show contract details nicely if viewing */}
            {initialMode === 'add' ? (
              <>
                 <InfoField 
                  icon={FileText} 
                  label="Contract No" 
                  field="contractNo"
                  formData={formData}
                  setFormData={setFormData}
                />
                 <InfoField 
                  icon={Calendar} 
                  label="Start Date" 
                  field="startDate"
                  type="date"
                  formData={formData}
                  setFormData={setFormData}
                />
                 <InfoField 
                  icon={Calendar} 
                  label="End Date" 
                  field="endDate"
                  type="date"
                  formData={formData}
                  setFormData={setFormData}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InfoField 
                    icon={FileText} 
                    label="Duration Value" 
                    field="durationValue"
                    type="number"
                    formData={formData}
                    setFormData={setFormData}
                  />
                  <InfoField 
                    icon={FileText} 
                    label="Duration Type" 
                    field="durationType"
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              </>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground w-full col-span-2 md:col-span-1">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-sm">Loading contract details...</span>
              </div>
            ) : contract ? (
              <>
                <div className="flex items-start gap-3 py-3 border-b border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">Contract No</p>
                    <p className="font-medium">{contract.contractNo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3 border-b border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">Contract Duration</p>
                    <p className="font-medium">{contract.durationValue} {contract.durationType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3 border-b border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">Contract Start</p>
                    <p className="font-medium">{contract.startDate ? new Date(contract.startDate).toLocaleDateString() : '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3 border-b border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">Contract End</p>
                    <p className="font-medium">{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : '-'}</p>
                  </div>
                </div>
              </>
            ) : initialMode === 'view' ? (
              <p className="text-sm text-muted-foreground italic py-3">No active contract found</p>
            ) : null}
            <InfoField 
              icon={Briefcase} 
              label="Specialization" 
              field="specialization"
              formData={formData}
              setFormData={setFormData}
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