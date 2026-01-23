import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { mockEmployees, Employee } from '../data/mockData';
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
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'add'>('view');

  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.contractNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveEmployee = (employee: Employee) => {
    if (modalMode === 'add') {
      // Add new employee
      const newEmployee: Employee = {
        ...employee,
        id: (employees.length + 1).toString(),
        contractNo: employee.contractNo || `C${String(employees.length + 1).padStart(3, '0')}`,
        accountNo: employee.accountNo || `A${String(employees.length + 1).padStart(3, '0')}`,
      };
      setEmployees([...employees, newEmployee]);
    } else {
      // Edit existing employee
      setEmployees(employees.map(emp =>
        emp.id === employee.id ? employee : emp
      ));
    }
    setIsDetailModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleDelete = () => {
    if (!selectedEmployee) return;
    
    setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const openAddModal = () => {
    setSelectedEmployee(null);
    setModalMode('add');
    setIsDetailModalOpen(true);
  };

  const openViewModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('view');
    setIsDetailModalOpen(true);
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

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Contract No</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Birthday</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Account No</TableHead>
              <TableHead>SIN</TableHead>
              <TableHead>PTIN</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.contractNo}</TableCell>
                  <TableCell>
                    <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                  </TableCell>
                  <TableCell>{employee.gender}</TableCell>
                  <TableCell>{new Date(employee.birthday).toLocaleDateString()}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.accountNo}</TableCell>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEmployee?.firstName} {selectedEmployee?.lastName}? This action cannot be undone.
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
        onSave={handleSaveEmployee}
        mode={modalMode}
      />
    </div>
  );
}