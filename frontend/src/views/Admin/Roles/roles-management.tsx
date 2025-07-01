import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Role } from "@/types/types";
import { Navbar } from "@/components/navigation/main-navbar";
import AdminSidebar from "@/views/Admin/Navigation/sidebar-menu";
import useMediaQuery from "@/hooks/useMediaQuery";

const API_URL = "http://localhost:3000/api/v1/roles/roles";

const RolesManagementPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 900px)");

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setRoles(res.data.roles || res.data);
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch roles");
      toast({ title: "Error", description: "Failed to fetch roles", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpen = (role?: Role) => {
    setEditRole(role || null);
    setForm(role ? { name: role.name, description: role.description } : { name: "", description: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditRole(null);
    setForm({ name: "", description: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editRole) {
        await axios.put(`${API_URL}/${editRole.id}`, form);
        toast({ title: "Role updated" });
      } else {
        await axios.post(API_URL, form);
        toast({ title: "Role added" });
      }
      fetchRoles();
      handleClose();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to save role", variant: "destructive" });
    }
  };

  const handleDelete = async (role: Role) => {
    if (!window.confirm(`Delete role '${role.name}'?`)) return;
    try {
      await axios.delete(`${API_URL}/${role.id}`);
      toast({ title: "Role deleted" });
      fetchRoles();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to delete role", variant: "destructive" });
    }
  };

  return (
    <>
      <Navbar className="z-[1]" />
      <AdminSidebar />
      <main className={`${!isMobile ? " ml-7px pt-[100px] pl-[300px] pr-[100px]" : "w-full py-20 px-2"} min-h-screen flex flex-col items-start`}>
        <div className="w-full max-w-7xl">
        <Card className="mb-6 w-90em">
      <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-[#137775]">
                  Roles Management
                </h1>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => handleOpen()} 
                      className="bg-[#137775] hover:bg-[#0f5f5d] text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>{editRole ? "Edit Role" : "Add Role"}</DialogTitle>
                      <DialogDescription>
                        {editRole ? "Update role details." : "Create a new role."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="name">Role Name</Label>
                        <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" value={form.description} onChange={handleChange} required />
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="rounded-lg px-6 py-2 text-base font-semibold">
                          {editRole ? "Update" : "Add"}
                        </Button>
                        <Button type="button" variant="ghost" onClick={handleClose} className="rounded-lg px-6 py-2 text-base font-semibold">
                          Cancel
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Icons.spinner className="w-8 h-8 text-[#137775] animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center bg-red-50 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                {roles.map((role) => (
                  <Card key={role.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200 w-80">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[#137775]/10 rounded-lg">
                          <Icons.RoleIcon className="w-5 h-5 text-[#137775]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {role.name}
                          </h3>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-6">
                        {role.description}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleOpen(role)} 
                          className="flex-1 text-xs"
                        >
                          <Icons.EditIcon className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDelete(role)} 
                          className="flex-1 text-xs text-white"
                        >
                          <Icons.DeleteIcon className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {roles.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Icons.RoleIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first role.</p>
                  <Button 
                    onClick={() => handleOpen()} 
                    className="bg-[#137775] hover:bg-[#0f5f5d] text-white"
                  >
                    Add Role
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default RolesManagementPage;