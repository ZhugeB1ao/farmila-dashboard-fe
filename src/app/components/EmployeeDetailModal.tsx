import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Employee } from '../hooks/useEmployee';
import { useDepartment } from '../hooks/useDepartment';
import { useContract, Contract } from '../hooks/useContract';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
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
  Camera,
  Cake,
  CreditCard,
  User
} from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: Employee | null;

  isLoading?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (employee: Employee, contract: Partial<Contract> | null, imageFile?: File) => void;
  mode?: 'view' | 'add';
}

const InfoField = ({ 
  icon: Icon, 
  label, 
  field, 
  type = 'text',
  formData,
  setFormData,
  readOnly = false
}: { 
  icon: any; 
  label: string; 
  field: keyof Employee;
  type?: 'text' | 'date' | 'email' | 'number';
  formData: Partial<Employee>;
  setFormData: (data: Partial<Employee>) => void;
  readOnly?: boolean;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      {readOnly ? (
        <div className="h-9 px-3 flex items-center bg-muted/50 rounded-md border border-input/50 text-muted-foreground text-sm italic">
          {formData[field]?.toString() || (field === 'id' ? '(Tạo tự động)' : '')}
        </div>
      ) : (
        <Input
          type={type}
          value={formData[field]?.toString() || ''}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          className="h-9"
        />
      )}
    </div>
  </div>
);

const ContractInfoField = ({ 
  icon: Icon, 
  label, 
  value,
  onChange,
  type = 'text',
}: { 
  icon: any; 
  label: string; 
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'date' | 'email' | 'number';
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-primary/10 last:border-0 text-foreground">
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <Input
        type={type}
        value={value?.toString() || ''}
        onChange={(e) => onChange(e.target.value)}
        className="h-9"
      />
    </div>
  </div>
);

export function EmployeeDetailModal({ 
  employee, 
  isLoading = false,
  open, 
  onOpenChange, 
  onSave,
  mode: initialMode = 'view'
}: EmployeeDetailModalProps) {
  const { departments } = useDepartment();
  const { fetchValidContract } = useContract();
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [contractFormData, setContractFormData] = useState<Partial<Contract>>({});
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoadingContract, setIsLoadingContract] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      setImagePreview(employee.avatar || null);
      
      // Fetch contract info
      const loadContract = async () => {
        setIsLoadingContract(true);
        try {
          const data = await fetchValidContract(employee.id);
          setContract(data);
          if (data) {
            setContractFormData(data);
          } else {
            setContractFormData({
              employeeId: employee.id,
              contractNo: '',
              startDate: '',
              endDate: '',
              duration: ''
            });
          }
        } catch (err) {
          console.error('Error fetching contract in modal:', err);
        } finally {
          setIsLoadingContract(false);
        }
      };
      loadContract();
    } else if (initialMode === 'add') {
      setContract(null);
      setContractFormData({
        employeeId: '',
        contractNo: '',
        startDate: '',
        endDate: '',
        duration: ''
      });
      setFormData({
        id: '',
        firstName: '',
        lastName: '',
        gender: 'Other',
        birthday: '',
        nationalId: '',
        address: '',
        phone: '',
        zaloNumber: '',
        email: '',
        hobby: '',
        favoriteSport: '',
        maritalStatus: 'Single',
        dateJoined: new Date().toISOString().split('T')[0],
        specialization: '',
        departmentId: '',
        departmentName: '',
        status: 'Active',
        salary: 0,
      });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [employee, open, initialMode]);

  const handleSave = () => {
    if (!formData.firstName) {
      toast.error('Vui lòng nhập họ nhân viên');
      return;
    }
    if (!formData.email) {
      toast.error('Vui lòng nhập email nhân viên');
      return;
    }

    if (onSave) {
      onSave(formData as Employee, contractFormData, imageFile || undefined);
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
            {initialMode === 'add' ? 'Thêm nhân viên mới' : 'Chi tiết nhân viên'}
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
                {displayData.firstName?.[0] || 'N'}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Họ</Label>
                  <Input
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="h-9"
                    placeholder="Họ"
                  />
                </div>
                <div>
                  <Label className="text-xs">Tên</Label>
                  <Input
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-9"
                    placeholder="Tên"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Chuyên môn</Label>
                  <Input
                    value={formData.specialization || ''}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="h-9"
                    placeholder="Chuyên môn"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Phòng ban</Label>
                  <select
                    value={formData.departmentId || ''}
                    onChange={(e) => {
                      const dept = departments?.find(d => d.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        departmentId: e.target.value,
                        departmentName: dept?.name || ''
                      });
                    }}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Chọn phòng ban</option>
                    {departments?.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border font-semibold">Thông tin cá nhân</h3>
            <InfoField icon={FileText} label="Mã nhân viên" field="id" formData={formData} setFormData={setFormData} readOnly={true} />
            <InfoField icon={User} label="Giới tính" field="gender" formData={formData} setFormData={setFormData} />
            <InfoField icon={Cake} label="Ngày sinh" field="birthday" type="date" formData={formData} setFormData={setFormData} />
            <InfoField icon={CreditCard} label="CCCD/CMND" field="nationalId" formData={formData} setFormData={setFormData} />
            <InfoField icon={MapPin} label="Địa chỉ" field="address" formData={formData} setFormData={setFormData} />
            <InfoField icon={Users} label="Tình trạng hôn nhân" field="maritalStatus" formData={formData} setFormData={setFormData} />
          </div>

          {/* Contact Information */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border font-semibold">Thông tin liên hệ</h3>
            <InfoField icon={Phone} label="Số điện thoại" field="phone" formData={formData} setFormData={setFormData} />
            <InfoField icon={MessageCircle} label="Số Zalo" field="zaloNumber" formData={formData} setFormData={setFormData} />
            <InfoField icon={Mail} label="Email" field="email" type="email" formData={formData} setFormData={setFormData} />
          </div>

          {/* Financial Information */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border font-semibold">Thông tin tài chính</h3>
            <div className="grid grid-cols-2 gap-x-4">
              <InfoField icon={CreditCard} label="Mã số bảo hiểm" field="sin" formData={formData} setFormData={setFormData} />
              <InfoField icon={FileText} label="Mã số thuế" field="ptin" formData={formData} setFormData={setFormData} />
            </div>
            <InfoField icon={Wallet} label="Tài khoản ngân hàng" field="bankAccount" formData={formData} setFormData={setFormData} />
            <InfoField icon={Landmark} label="Ngân hàng" field="bank" formData={formData} setFormData={setFormData} />
          </div>

          {/* Personal Interests */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border font-semibold">Sở thích cá nhân</h3>
            <InfoField icon={Heart} label="Sở thích" field="hobby" formData={formData} setFormData={setFormData} />
            <InfoField icon={Trophy} label="Môn thể thao yêu thích" field="favoriteSport" formData={formData} setFormData={setFormData} />
          </div>

          {/* Employment Details */}
          <div className="space-y-1">
            <h3 className="mb-4 pb-2 border-b border-border font-semibold">Chi tiết công việc</h3>
            <InfoField 
              icon={Calendar} 
              label="Ngày gia nhập" 
              field="dateJoined"
              type="date"
              formData={formData}
              setFormData={setFormData}
            />
            <InfoField 
              icon={Briefcase} 
              label="Chức vụ" 
              field="position"
              formData={formData}
              setFormData={setFormData}
            />
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">Trạng thái</p>
                    <select 
                        value={formData.status || 'Active'} 
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="w-full h-9 bg-background border border-input rounded-md px-3 text-sm"
                    >
                        <option value="Active">Đang làm việc</option>
                        <option value="Inactive">Nghỉ việc</option>
                        <option value="On Leave">Đang nghỉ phép</option>
                    </select>
                    </div>
                </div>
                <InfoField 
                  icon={Wallet} 
                  label="Lương" 
                  field="salary"
                  type="number"
                  formData={formData}
                  setFormData={setFormData}
                />
            </div>
          </div>

          {/* Contract Information Section */}
          <div className="md:col-span-2 space-y-1 mt-4">
            <h3 className="mb-4 pb-2 border-b border-border font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Thông tin hợp đồng
            </h3>
            {isLoadingContract ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground bg-accent/20 rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Đang tải thông tin hợp đồng...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="space-y-1">
                  <ContractInfoField 
                    icon={FileText} 
                    label="Số hợp đồng" 
                    value={contractFormData.contractNo || ''}
                    onChange={(val) => setContractFormData({...contractFormData, contractNo: val})}
                  />
                  <ContractInfoField 
                    icon={Calendar} 
                    label="Ngày bắt đầu" 
                    value={contractFormData.startDate || ''}
                    type="date"
                    onChange={(val) => setContractFormData({...contractFormData, startDate: val})}
                  />
                </div>
                <div className="space-y-1">
                  <ContractInfoField 
                    icon={Briefcase} 
                    label="Thời hạn" 
                    value={contractFormData.duration || ''}
                    onChange={(val) => setContractFormData({...contractFormData, duration: val})}
                  />
                  <ContractInfoField 
                    icon={Calendar} 
                    label="Ngày kết thúc" 
                    value={contractFormData.endDate || ''}
                    type="date"
                    onChange={(val) => setContractFormData({...contractFormData, endDate: val})}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isLoading 
              ? (initialMode === 'add' ? 'Đang thêm...' : 'Đang lưu...') 
              : (initialMode === 'add' ? 'Thêm nhân viên' : 'Lưu thay đổi')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}