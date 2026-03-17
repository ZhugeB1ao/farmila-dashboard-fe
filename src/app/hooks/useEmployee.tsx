import { supabase } from "../../lib/supabase/client";
import { uploadProfileImage } from "../../lib/supabase/storage";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export interface Employee {
  id: string;
  contractNo: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  birthday: string;
  nationalId: string;
  address: string;
  email: string;
  phone: string;
  zaloNumber: string;
  position: string;
  departmentId: string;
  departmentName: string;
  accountNo: string;
  bankAccount: string;
  bank: string;
  sin: string;
  ptin: string;
  hobby: string;
  favoriteSport: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  specialization: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  dateJoined: string;
  salary: number;
  manager?: string;
  avatar?: string;
}

export const useEmployee = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [user]);

  const mapFromDb = (data: any): Employee => {
    // Find active contract if nested contracts exist
    let activeContractNo = "";
    if (data.contracts && Array.isArray(data.contracts)) {
      const now = new Date().toISOString().split('T')[0];
      const activeContract = data.contracts.find((c: any) => {
        const start = c.start_date || "";
        const end = c.end_date || "";
        return start <= now && end >= now;
      }) || data.contracts[0]; // Fallback to first contract if none is currently valid
      
      activeContractNo = activeContract?.contract_no || "";
    }

    return {
      id: data.id.toString(),
      contractNo: activeContractNo || data.contract_no || "",
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      gender: data.gender || "Other",
      birthday: data.birthday || "",
      nationalId: data.national_id || "",
      address: data.address || "",
      email: data.email || "",
      phone: data.phone || "",
      zaloNumber: data.zalo_number || "",
      position: data.position || "",
      departmentId: data.department_id?.toString() || "",
      departmentName: data.departments?.name || "Unassigned",
      accountNo: data.account_no || "",
      bankAccount: data.bank_account || "",
      bank: data.bank || "",
      sin: data.sin || "",
      ptin: data.ptin || "",
      hobby: data.hobby || "",
      favoriteSport: data.favorite_sport || "",
      maritalStatus: data.marital_status || "Single",
      specialization: data.specialization || "",
      status: data.status || "Active",
      dateJoined: data.date_joined || "",
      salary: data.salary || 0,
      avatar: data.avatar || "",
    };
  };

  const mapToDatabase = (employee: Partial<Employee>) => {
    const dbData: any = {
      first_name: employee.firstName,
      last_name: employee.lastName,
      gender: employee.gender,
      birthday: employee.birthday || null,
      national_id: employee.nationalId || null,
      address: employee.address || null,
      email: employee.email,
      phone: employee.phone || null,
      zalo_number: employee.zaloNumber || null,
      position: employee.position || null,
      department_id: employee.departmentId ? parseInt(employee.departmentId) : null,
      bank_account: employee.bankAccount || null,
      bank: employee.bank || null,
      sin: employee.sin || null,
      ptin: employee.ptin || null,
      hobby: employee.hobby || null,
      favorite_sport: employee.favoriteSport || null,
      marital_status: employee.maritalStatus || 'Single',
      specialization: employee.specialization || null,
      status: employee.status || 'Active',
      salary: employee.salary ? parseFloat(employee.salary.toString()) : 0,
      avatar: employee.avatar || null,
    };

    // Remove undefined fields
    Object.keys(dbData).forEach(key => (dbData[key] === undefined) && delete dbData[key]);
    
    return dbData;
  };

  const fetchEmployees = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*, departments(name), contracts(*)")
        .order("id", { ascending: true });

      if (error) throw error;
      setEmployees(data ? data.map(mapFromDb) : []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };


  const createEmployee = async (employeeData: Partial<Employee>, imageFile?: File) => {
    if (!user) throw new Error("User not authenticated");

    try {
      setLoading(true);
      // 1. Create employee first to get ID
      const { data, error } = await supabase
        .from("employees")
        .insert([mapToDatabase(employeeData)])
        .select("*, departments(name), contracts(*)")
        .single();

      if (error) throw error;
      
      let finalData = data;

      // 2. Upload image if provided and update record
      if (imageFile && data) {
        try {
          const avatarUrl = await uploadProfileImage(imageFile, data.id.toString());
          const { data: updatedData, error: updateError } = await supabase
            .from("employees")
            .update({ avatar: avatarUrl })
            .eq("id", data.id)
            .select("*, departments(name), contracts(*)")
            .single();
          
          if (!updateError) finalData = updatedData;
        } catch (imgError) {
          console.error("Error uploading avatar:", imgError);
        }
      }

      if (finalData) {
        setEmployees(prev => {
          const newEmployees = prev ? [mapFromDb(finalData), ...prev] : [mapFromDb(finalData)];
          return [...newEmployees].sort((a, b) => parseInt(a.id) - parseInt(b.id));
        });
      }
      return finalData;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>, imageFile?: File) => {
    if (!user) throw new Error("User not authenticated");

    try {
      setLoading(true);
      let avatarUrl = employeeData.avatar;

      // 1. Upload new image if provided
      if (imageFile) {
        try {
          avatarUrl = await uploadProfileImage(imageFile, id);
        } catch (imgError) {
          console.error("Error uploading avatar:", imgError);
        }
      }

      // 2. Update employee
      const updateData = { ...employeeData, avatar: avatarUrl };
      const { data, error } = await supabase
        .from("employees")
        .update(mapToDatabase(updateData))
        .eq("id", id)
        .select("*, departments(name), contracts(*)")
        .single();

      if (error) throw error;
      
      if (data) {
        setEmployees(prev => {
          const updated = prev ? prev.map(emp => emp.id === id ? mapFromDb(data) : emp) : [mapFromDb(data)];
          return [...updated].sort((a, b) => parseInt(a.id) - parseInt(b.id));
        });
      }
      return data;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      setLoading(true);
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setEmployees(prev => prev ? prev.filter(emp => emp.id !== id) : []);
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeById = async (id: string): Promise<Employee | null> => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data ? mapFromDb(data) : null;
    } catch (error) {
      console.error("Error fetching employee by id:", error);
      return null;
    }
  };

  return { 
    createEmployee, 
    updateEmployee, 
    deleteEmployee, 
    employees, 
    loading, 
    fetchEmployees, 
    fetchEmployeeById 
  };
};