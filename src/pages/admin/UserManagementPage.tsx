import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { UserTable } from '@/components/admin/UserTable';
import { UserFormDialog } from '@/components/admin/UserFormDialog';
import { useAdminStore } from '@/stores/adminStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Users, Plus } from 'lucide-react';
import { User, UserRole } from '@/types/admin';
import { toast } from 'sonner';

export default function UserManagementPage() {
  const { users, addUser, loadUsers, updateUser, updateUserRole, toggleUserActive, deleteUser } = useAdminStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  useEffect((   ) => {
    loadUsers();
    console.log("Users loaded in UserManagementPage:", users);
  }, []);
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateUserRole(userId, role);
    toast.success('User role updated successfully');
  };

 const handleToggleActive = (userId) => {
  toggleUserActive(userId);
  toast.success('User status updated');
};

  const handleDelete = (userId: string) => {
    deleteUser(userId);
    toast.success('User deleted successfully');
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const handleFormSubmit = (data: { name: string; email: string; role: UserRole; isActive: boolean }) => {
    if (editingUser) {
      updateUser(editingUser.id, data);
      toast.success('User updated successfully');
    } else {
      addUser({ ...data, lastLoginAt: undefined });
      toast.success('User added successfully');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage users and their roles</p>
              </div>
            </div>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value as UserRole | 'ALL')}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="FARMER">Farmer</SelectItem>
                <SelectItem value="AGRONOMIST">Agronomist</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">Farmers</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'FARMER').length}</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">Agronomists</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'AGRONOMIST').length}</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{users.filter(u => u.isActive).length}</p>
            </div>
          </div>

          {/* User Table */}
          <UserTable
            users={filteredUsers}
            onRoleChange={handleRoleChange}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}

          <UserFormDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            user={editingUser}
            onSubmit={handleFormSubmit}
          />
        </div>
      </main>
    </div>
  );
}
