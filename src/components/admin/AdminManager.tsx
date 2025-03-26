import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Mail, UserPlus, Loader2, RefreshCw, ShieldCheck, Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Admin {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  is_first_admin?: boolean;
}

interface User {
  id: string;
  email: string;
  created_at: string;
}

const AdminManager = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Mark the first admin in the list (oldest created_at)
      const processedAdmins: Admin[] = data?.map((admin, index) => ({
        ...admin,
        is_first_admin: index === 0
      })) || [];
      
      setAdmins(processedAdmins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast({
        title: "Error fetching admins",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingAdmins(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('authenticated_users_view')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchUsers();
  }, []);

  const handleAddAdmin = async () => {
    if (!newAdminEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setAddingAdmin(true);
      
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from('authenticated_users_view')
        .select('id')
        .eq('email', newAdminEmail)
        .single();
      
      if (userError) {
        toast({
          title: "User not found",
          description: "Make sure the user has registered and authenticated with this email",
          variant: "destructive",
        });
        return;
      }
      
      // Check if already an admin
      const { data: existingAdmin, error: adminCheckError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', newAdminEmail);
      
      if (adminCheckError) throw adminCheckError;
      
      if (existingAdmin && existingAdmin.length > 0) {
        // If already an admin but inactive, activate them
        if (!existingAdmin[0].is_active) {
          const { error: updateError } = await supabase
            .from('admins')
            .update({ is_active: true })
            .eq('id', existingAdmin[0].id);
          
          if (updateError) throw updateError;
          
          toast({
            title: "Admin reactivated",
            description: `${newAdminEmail} has been reactivated as an admin`,
          });
        } else {
          toast({
            title: "Already an admin",
            description: `${newAdminEmail} is already an active admin`,
          });
        }
      } else {
        // Add as new admin
        const { error: insertError } = await supabase
          .from('admins')
          .insert([{ id: userData.id, email: newAdminEmail }]);
        
        if (insertError) throw insertError;
        
        toast({
          title: "Admin added",
          description: `${newAdminEmail} has been added as an admin`,
        });
      }
      
      setNewAdminEmail("");
      fetchAdmins();
    } catch (error) {
      console.error("Error adding admin:", error);
      toast({
        title: "Error adding admin",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleToggleAdmin = async (admin: Admin) => {
    // Prevent deactivation of the first admin
    if (admin.is_first_admin && admin.is_active) {
      toast({
        title: "Cannot deactivate",
        description: "The first admin cannot be deactivated",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('admins')
        .update({ is_active: !admin.is_active })
        .eq('id', admin.id);
      
      if (error) throw error;
      
      toast({
        title: admin.is_active ? "Admin deactivated" : "Admin activated",
        description: `${admin.email} has been ${admin.is_active ? "deactivated" : "activated"}`,
      });
      
      fetchAdmins();
    } catch (error) {
      console.error("Error toggling admin status:", error);
      toast({
        title: "Error updating admin",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchAdmins(), fetchUsers()]);
    setRefreshing(false);
  };

  const renderMobileAdminList = () => (
    <div className="space-y-3 mt-4">
      {admins.map(admin => (
        <Card key={admin.id} className="bg-black/40 border-white/10">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-white flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-[#D946EF]" />
                  {admin.email}
                  {admin.is_first_admin && (
                    <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                      First Admin
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Added: {new Date(admin.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                <span className={`mr-2 px-2 py-0.5 rounded text-xs ${admin.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {admin.is_active ? 'Active' : 'Inactive'}
                </span>
                {admin.is_first_admin && admin.is_active ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={true}
                    className="border-gray-500/30 text-gray-400 cursor-not-allowed"
                  >
                    Protected
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleAdmin(admin)}
                    className={admin.is_active ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-green-500/30 text-green-400 hover:bg-green-500/10'}
                  >
                    {admin.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderMobileUserList = () => (
    <div className="space-y-3 mt-4">
      {users.map(user => (
        <Card key={user.id} className="bg-black/40 border-white/10">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-white flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-blue-400" />
                  {user.email}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Registered: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                {admins.some(admin => admin.email === user.email && admin.is_active) ? (
                  <span className="px-2 py-1 bg-[#D946EF]/20 text-[#D946EF] rounded-full text-xs flex items-center gap-1 inline-flex justify-center">
                    <ShieldCheck className="h-3 w-3" /> Admin
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setNewAdminEmail(user.email);
                      setTimeout(() => {
                        handleAddAdmin();
                      }, 100);
                    }}
                    className="border-[#D946EF]/30 text-[#D946EF] hover:bg-[#D946EF]/10 text-xs"
                  >
                    <UserPlus className="h-3 w-3 mr-1" /> Make Admin
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield size={24} className="text-[#D946EF]" /> User & Admin Management
        </h2>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-black/30 hover:bg-black/50 border border-white/10 text-white"
        >
          {refreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Admin Section */}
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-white/10">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#D946EF]" /> Administrators
          </h3>
          
          <div className="flex space-x-2 mb-6">
            <Input
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="Enter email to add admin"
              className="bg-black/40 border-white/10 text-white"
            />
            <Button
              onClick={handleAddAdmin}
              disabled={addingAdmin || !newAdminEmail}
              className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white whitespace-nowrap"
            >
              {addingAdmin ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Add Admin
                </>
              )}
            </Button>
          </div>
          
          {loadingAdmins ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-[#D946EF]" />
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No administrators found
            </div>
          ) : isMobile ? (
            renderMobileAdminList()
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Added</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">
                      {admin.email}
                      {admin.is_first_admin && (
                        <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                          First Admin
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${admin.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-400">{new Date(admin.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      {admin.is_first_admin && admin.is_active ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={true}
                          className="border-gray-500/30 text-gray-400 cursor-not-allowed"
                        >
                          Protected
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleAdmin(admin)}
                          className={admin.is_active ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-green-500/30 text-green-400 hover:bg-green-500/10'}
                        >
                          {admin.is_active ? (
                            <>
                              <X className="h-4 w-4 mr-1" /> Deactivate
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" /> Activate
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        
        {/* Users Section */}
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-white/10">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-400" /> Registered Users
          </h3>
          
          {loadingUsers ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No users found
            </div>
          ) : isMobile ? (
            renderMobileUserList()
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Registered</TableHead>
                  <TableHead className="text-white text-right">Admin Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{user.email}</TableCell>
                    <TableCell className="text-gray-400">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      {admins.some(admin => admin.email === user.email && admin.is_active) ? (
                        <span className="px-2 py-1 bg-[#D946EF]/20 text-[#D946EF] rounded-full text-xs flex items-center gap-1 inline-flex justify-center">
                          <ShieldCheck className="h-3 w-3" /> Admin
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setNewAdminEmail(user.email);
                            setTimeout(() => {
                              handleAddAdmin();
                            }, 100);
                          }}
                          className="border-[#D946EF]/30 text-[#D946EF] hover:bg-[#D946EF]/10"
                        >
                          <UserPlus className="h-4 w-4 mr-1" /> Make Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManager;
