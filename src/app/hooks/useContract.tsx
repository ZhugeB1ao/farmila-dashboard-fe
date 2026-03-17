import { supabase } from "../../lib/supabase/client";
import { useState, useCallback } from "react";

export interface Contract {
  id: string;
  employeeId: string;
  contractNo: string;
  startDate: string;
  endDate: string;
  duration: string;
}

export const useContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchValidContract = useCallback(async (employeeId: string): Promise<Contract | null> => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date().toISOString().split('T')[0];
      const { data, error: contractError } = await supabase
        .from("contracts")
        .select("*")
        .eq("employee_id", employeeId)
        .lte("start_date", now)
        .gte("end_date", now)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (contractError) throw contractError;

      if (data) {
        return {
          id: data.id.toString(),
          employeeId: data.employee_id.toString(),
          contractNo: data.contract_no || "",
          startDate: data.start_date || "",
          endDate: data.end_date || "",
          duration: data.duration || "",
        };
      }
      return null;
    } catch (err: any) {
      console.error("Error fetching valid contract:", err);
      setError(err.message || "Failed to fetch contract");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createContract = useCallback(async (contract: Partial<Contract>): Promise<Contract | null> => {
    setLoading(true);
    setError(null);
    try {
      const dbContract = {
        employee_id: contract.employeeId,
        contract_no: contract.contractNo,
        start_date: contract.startDate || null,
        end_date: contract.endDate || null,
        duration: contract.duration || null,
      };

      const { data, error: contractError } = await supabase
        .from("contracts")
        .insert([dbContract])
        .select()
        .single();

      if (contractError) throw contractError;

      return {
        id: data.id.toString(),
        employeeId: data.employee_id.toString(),
        contractNo: data.contract_no,
        startDate: data.start_date,
        endDate: data.end_date,
        duration: data.duration,
      };
    } catch (err: any) {
      console.error("Error creating contract:", err);
      setError(err.message || "Failed to create contract");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContract = useCallback(async (id: string, contract: Partial<Contract>): Promise<Contract | null> => {
    setLoading(true);
    setError(null);
    try {
      const dbContract: any = {};
      if (contract.contractNo) dbContract.contract_no = contract.contractNo;
      if (contract.startDate) dbContract.start_date = contract.startDate;
      if (contract.endDate) dbContract.end_date = contract.endDate;
      if (contract.duration !== undefined) dbContract.duration = contract.duration;

      const { data, error: contractError } = await supabase
        .from("contracts")
        .update(dbContract)
        .eq("id", id)
        .select()
        .single();

      if (contractError) throw contractError;

      return {
        id: data.id.toString(),
        employeeId: data.employee_id.toString(),
        contractNo: data.contract_no,
        startDate: data.start_date,
        endDate: data.end_date,
        duration: data.duration,
      };
    } catch (err: any) {
      console.error("Error updating contract:", err);
      setError(err.message || "Failed to update contract");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchValidContract,
    createContract,
    updateContract,
    loading,
    error
  };
};
