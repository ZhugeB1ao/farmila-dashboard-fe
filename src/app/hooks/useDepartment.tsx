import { supabase } from "../../lib/supabase/client";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export interface Department {
  id: string;
  name: string;
  manager?: string; 
  employeeCount?: number;
  description?: string;
}

export const useDepartment = () => {
    const { user } = useAuth();
    const [departments, setDepartments] = useState<Department[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDepartments();
    }, [user]);

    const fetchDepartments = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from("departments")
                .select("*")
                .order("name", { ascending: true });

            if (fetchError) throw fetchError;
            setDepartments(data ? data.map(d => ({
                id: d.id.toString(),
                name: d.name || ""
            })) : []);
        } catch (err: any) {
            console.error("Error fetching departments:", err);
            setError(err.message || "Failed to fetch departments");
        } finally {
            setLoading(false);
        }
    };

    const createDepartment = async (name: string) => {
        if (!user) throw new Error("User not authenticated");
        setLoading(true);
        setError(null);

        try {
            const { data, error: createError } = await supabase
                .from("departments")
                .insert([{ name }])
                .select()
                .single();

            if (createError) throw createError;
            if (data) {
                const newDept = { id: data.id.toString(), name: data.name };
                setDepartments(prev => prev ? [...prev, newDept] : [newDept]);
            }
            return data;
        } catch (err: any) {
            console.error("Error creating department:", err);
            setError(err.message || "Failed to create department");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateDepartment = async (id: string, name: string) => {
        if (!user) throw new Error("User not authenticated");
        setLoading(true);
        setError(null);

        try {
            const { data, error: updateError } = await supabase
                .from("departments")
                .update({ name })
                .eq("id", id)
                .select()
                .single();

            if (updateError) throw updateError;
            if (data) {
                setDepartments(prev => prev ? prev.map(d => d.id === id ? { ...d, name: data.name } : d) : []);
            }
            return data;
        } catch (err: any) {
            console.error("Error updating department:", err);
            setError(err.message || "Failed to update department");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteDepartment = async (id: string) => {
        if (!user) throw new Error("User not authenticated");
        setLoading(true);
        setError(null);

        try {
            const { error: deleteError } = await supabase
                .from("departments")
                .delete()
                .eq("id", id);

            if (deleteError) throw deleteError;
            setDepartments(prev => prev ? prev.filter(d => d.id !== id) : []);
        } catch (err: any) {
            console.error("Error deleting department:", err);
            setError(err.message || "Failed to delete department");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { departments, loading, error, fetchDepartments, createDepartment, updateDepartment, deleteDepartment };
};
