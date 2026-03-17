import { useState, useMemo } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2, Loader2, Filter } from 'lucide-react';
import { useEmployee, Employee } from '../hooks/useEmployee';
import { useContract, Contract } from '../hooks/useContract';
import { useDepartment } from '../hooks/useDepartment';

import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  Table,

  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { EmployeeDetailModal } from '../components/EmployeeDetailModal';

export function EmployeesPage() {
  const { employees, loading: isLoading, createEmployee, updateEmployee, deleteEmployee } = useEmployee();
  const { createContract, updateContract } = useContract();
  const { departments } = useDepartment();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'add'>('view');

  const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

  const filteredEmployees = useMemo(() => {
    return (employees || []).filter(emp => {
      const matchesSearch = (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = selectedDeptId === 'all' || emp.departmentId === selectedDeptId;
      const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;
      const matchesGender = selectedGender === 'all' || emp.gender === selectedGender;
      
      return matchesSearch && matchesDept && matchesStatus && matchesGender;
    });
  }, [employees, searchQuery, selectedDeptId, selectedStatus, selectedGender]);

  const handleSaveEmployee = async (employee: Employee, contract: Partial<Contract> | null, imageFile?: File) => {
    try {
      setIsSaving(true);
      if (modalMode === 'add') {
        const newEmployee = await createEmployee(employee, imageFile);
        if (newEmployee && contract) {
          await createContract({ ...contract, employeeId: newEmployee.id });
        }
        toast.success('Thêm nhân viên và hợp đồng thành công');
      } else {
        await updateEmployee(employee.id, employee, imageFile);
        if (contract) {
          if (contract.id) {
            await updateContract(contract.id, contract);
          } else {
            await createContract({ ...contract, employeeId: employee.id });
          }
        }
        toast.success('Cập nhật nhân viên và hợp đồng thành công');
      }
      setIsDetailModalOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      console.error('Error saving employee or contract:', err);
      toast.error('Lưu nhân viên và hợp đồng thất bại. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    
    try {
      await deleteEmployee(selectedEmployee.id);
      toast.success('Xóa nhân viên thành công');
    } catch (err) {
      console.error('Error deleting employee:', err);
      toast.error('Xóa nhân viên thất bại.');
    }
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleViewDetails = async (employee: Employee) => {
    setIsLoadingDetail(true);
    setModalMode('view');
    setIsDetailModalOpen(true);
    setSelectedEmployee(employee);
    // Note: fetchEmployeeWithContract is currently missing from Supabase implementation,
    // assuming it will be added to useEmployee or we just use employee data for now.

    setIsLoadingDetail(false);
  };

  const openDeleteDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const openAddModal = () => {
    setSelectedEmployee(null);

    setModalMode('add');
    setIsDetailModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nhân viên</h1>
          <p className="text-muted-foreground">
            Quản lý nhân viên trong tổ chức của bạn
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Thêm nhân viên
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Tìm kiếm tên nhân viên…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card"
            autoComplete="off"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="flex h-9 w-[200px] rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">Tất cả phòng ban</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex h-9 w-[160px] rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Đang làm việc</option>
            <option value="Inactive">Nghỉ việc</option>
            <option value="On Leave">Đang nghỉ phép</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="flex h-9 w-[140px] rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">Tất cả giới tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Other">Khác</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <span className="ml-2 text-muted-foreground">Đang tải danh sách nhân viên…</span>
        </div>
      ) : null}

      {/* Employee Table */}
      {!isLoading && (
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Số hợp đồng</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Phòng ban</TableHead>
              <TableHead>Tài khoản ngân hàng</TableHead>
              <TableHead>Mã số bảo hiểm</TableHead>
              <TableHead>Mã số thuế</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Không tìm thấy nhân viên nào
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.contractNo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                         <AvatarImage src={employee.avatar} />
                         <AvatarFallback>{employee.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                    </div>
                  </TableCell>
                  <TableCell>{employee.gender === 'Male' ? 'Nam' : employee.gender === 'Female' ? 'Nữ' : 'Khác'}</TableCell>
                  <TableCell>{employee.birthday ? new Date(employee.birthday).toLocaleDateString('vi-VN') : ''}</TableCell>
                  <TableCell>{employee.departmentName}</TableCell>
                  <TableCell>{employee.bankAccount}</TableCell>
                  <TableCell>{employee.sin}</TableCell>
                  <TableCell>{employee.ptin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Employee actions">
                          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(employee)}>
                          <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(employee)}
                          className="text-destructive font-medium"
                        >
                          <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa nhân viên</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa {selectedEmployee?.firstName} {selectedEmployee?.lastName}? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Detail/Add/Edit Modal */}
      <EmployeeDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        employee={selectedEmployee}

        isLoading={isLoadingDetail || isSaving}
        onSave={handleSaveEmployee}
        mode={modalMode}
      />
      <Toaster />
    </div>
  );
}