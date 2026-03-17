import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useDepartment, Department } from '../hooks/useDepartment';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';
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
import { Label } from '../components/ui/label';

export function DepartmentsPage() {
  const { departments, loading, error, createDepartment, updateDepartment, deleteDepartment } = useDepartment();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleAdd = async () => {
    if (!name) return;
    try {
        await createDepartment(name);
        setIsAddDialogOpen(false);
        setName('');
        toast.success('Tạo phòng ban thành công');
    } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Tạo phòng ban thất bại');
    }
  };

  const handleEdit = async () => {
    if (!selectedDepartment || !name) return;
    try {
        await updateDepartment(selectedDepartment.id, name);
        setIsEditDialogOpen(false);
        setSelectedDepartment(null);
        setName('');
        toast.success('Cập nhật phòng ban thành công');
    } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Cập nhật phòng ban thất bại');
    }
  };

  const handleDelete = async () => {
    if (!selectedDepartment) return;
    try {
        await deleteDepartment(selectedDepartment.id);
        setIsDeleteDialogOpen(false);
        setSelectedDepartment(null);
        toast.success('Xóa phòng ban thành công');
    } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Xóa phòng ban thất bại');
    }
  };

  const openEditDialog = (department: Department) => {
    setSelectedDepartment(department);
    setName(department.name);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Phòng ban</h1>
          <p className="text-muted-foreground">
            Quản lý các phòng ban trong tổ chức
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Thêm phòng ban
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-destructive">
            <AlertCircle className="h-12 w-12 mb-4" />
            <p className="font-medium">Lỗi khi tải danh sách phòng ban</p>
            <p className="text-sm opacity-80">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments && departments.length > 0 ? (
                departments.map((department) => (
                    <Card key={department.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{department.name}</CardTitle>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditDialog(department)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                onClick={() => openDeleteDialog(department)}
                                className="text-destructive font-medium"
                                >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        </CardHeader>
                    </Card>
                ))
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">Không tìm thấy phòng ban nào. Hãy tạo mới để bắt đầu.</p>
                </div>
            )}
        </div>
      )}

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm phòng ban mới</DialogTitle>
            <DialogDescription>
              Tạo một phòng ban mới trong tổ chức của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên phòng ban</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marketing, Kỹ thuật, v.v."
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAdd} disabled={!name || loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                'Thêm phòng ban'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa phòng ban</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin phòng ban
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên phòng ban</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEdit} disabled={!name || loading}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa phòng ban</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phòng ban {selectedDepartment?.name}? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
