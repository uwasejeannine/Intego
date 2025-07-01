import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns } from "@/components/tables/users/columns";
import { DataTable } from "@/components/tables/users/data-table";
import { Navbar } from "@/components/navigation/main-navbar";
import { Button } from "@/components/ui/button";
import AdminSidebar from "../Navigation/sidebar-menu";
import { Card } from "@/components/ui/card";
import { fetchUsers } from "@/lib/api/api";
import { Profile } from "@/types/types";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function UserViewPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Profile[]>([]);
  const [activeUsers, setActiveUsers] = useState<Profile[]>([]);
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const isMobile = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    fetchUsers().then((data) => {
      setData(data);
      setActiveUsers(data.filter((user) => user.status === "Active"));
      setPendingUsers(data.filter((user) => user.status === "Inactive"));
    });
    setInitialLoading(false);
  }, []);

  return (
    <>
      <Navbar className="z-[1]" />
      <AdminSidebar />
      <main
        className={`${!isMobile ? "pt-[80px] pl-[250px] pr-[10px]" : "w-full px-2 py-20"}`}
      >
        <Tabs defaultValue="all-users" className="space-y-4">
          <Card className="h-[70px] w-full flex items-center pl-[70px] justify-items-center  dark:bg-slate-500">
            <TabsList className="w-[93%] items-start flex justify-between">
              <div>
                <TabsTrigger value="all-users">All Users</TabsTrigger>
                <TabsTrigger value="active-users">Active Users</TabsTrigger>
                <TabsTrigger value="pending-users">Pending Users</TabsTrigger>
              </div>
              <div className="flex justify-items-end">
                <Button
                  className="h-8 mr-3 bg-[#137775]"
                  onClick={() => navigate("/admin/add-user")}
                >
                  Add New User
                </Button>
              </div>
            </TabsList>
          </Card>
          <Card className="w-full dark:bg-slate-500">
            <TabsContent value="all-users">
              <DataTable
                columns={columns}
                data={data}
                userType="admin"
                initialLoading={initialLoading}
              />
            </TabsContent>
            <TabsContent value="active-users">
              <DataTable
                columns={columns}
                data={activeUsers}
                userType="admin"
                initialLoading={false}
              />
            </TabsContent>
            <TabsContent value="pending-users">
              <DataTable
                columns={columns}
                data={pendingUsers}
                userType="admin"
                initialLoading={false}
              />
            </TabsContent>
          </Card>
        </Tabs>
      </main>
    </>
  );
}