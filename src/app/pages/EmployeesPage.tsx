import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2, Loader2 } from 'lucide-react';
import { fetchEmployees, deleteEmployee as deleteEmployeeApi, fetchEmployeeWithContract, createEmployee, updateEmployee, Employee, Contract } from '../services/employeeService';
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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'add'>('view');

  // Fetch employees from API on component mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (err) {
        setError('Failed to load employees. Please try again later.');
        console.error('Error loading employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (emp.bankAccount && emp.bankAccount.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveEmployee = async (employee: Employee, imageFile?: File) => {
    try {
      if (modalMode === 'add') {
        const newEmployee = await createEmployee(employee, imageFile);
        setEmployees([...employees, newEmployee]);
        toast.success('Employee created successfully');
      } else {
        // Edit existing employee
        const updatedEmployee = await updateEmployee(employee.id, employee, imageFile);
        setEmployees(employees.map(emp =>
          emp.id === employee.id ? updatedEmployee : emp
        ));
        toast.success('Employee updated successfully');
      }
      setIsDetailModalOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      console.error('Error saving employee:', err);
      toast.error('Failed to save employee. Please try again.');
      // Do NOT close the modal on error
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    
    try {
      await deleteEmployeeApi(selectedEmployee.id);
      setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
    } catch (err) {
      console.error('Error deleting employee:', err);
      // Still remove from UI for now, you can add error handling here
      setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const openAddModal = () => {
    setSelectedEmployee(null);
    setSelectedContract(null);
    setModalMode('add');
    setIsDetailModalOpen(true);
  };

  const openViewModal = async (employee: Employee) => {
    setIsLoadingDetail(true);
    setModalMode('view');
    setIsDetailModalOpen(true);
    
    try {
      // Call both APIs in parallel
      const { employee: fullEmployee, contract } = await fetchEmployeeWithContract(employee.id);
      setSelectedEmployee(fullEmployee);
      setSelectedContract(contract);
    } catch (err) {
      console.error('Error fetching employee details:', err);
      // Fallback to basic employee data if API fails
      setSelectedEmployee(employee);
      setSelectedContract(null);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const openDeleteDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Employees</h1>
          <p className="text-muted-foreground">
            Manage your organization's employees
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading employees...</span>
        </div>
      ) : null}

      {/* Error State */}
      {error && !isLoading ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
          {error}
        </div>
      ) : null}

      {/* Employee Table */}
      {!isLoading && !error ? (
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Birthday</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Bank Account</TableHead>
              <TableHead>SIN</TableHead>
              <TableHead>PTIN</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>
                    <p className="font-medium">{employee.fullName}</p>
                  </TableCell>
                  <TableCell>{employee.gender}</TableCell>
                  <TableCell>{new Date(employee.birthday).toLocaleDateString()}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.bankAccount}</TableCell>
                  <TableCell>{employee.sin}</TableCell>
                  <TableCell>{employee.ptin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewModal(employee)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(employee)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
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
      ) : null}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEmployee?.fullName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Detail/Add/Edit Modal */}
      <EmployeeDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        employee={selectedEmployee}
        contract={selectedContract}
        isLoading={isLoadingDetail}
        onSave={handleSaveEmployee}
        mode={modalMode}
      />
      <Toaster />
    </div>
  );
}