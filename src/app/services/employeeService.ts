// API Employee interface matching the backend response
export interface ApiEmployee {
  id: string;
  fullName: string;
  gender: string;
  birthDay: string;
  department: string;
  bankAccount: string;
  bank: string;
  sin: string;
  ptin: string;
  nationalId: string;
  address: string;
  phoneNo: string;
  zaloNo: string;
  email: string;
  hobby: string;
  favoriteSport: string;
  maritalStatus: string;
  dateIn: string;
  specialization: string;
  image?: string;
  // Optional contract fields for creation
  contractNo?: string;
  startDate?: string;
  endDate?: string;
  durationValue?: string;
  durationType?: string;
}

// Frontend Employee interface for the UI
export interface Employee {
  id: string;
  fullName: string;
  gender: string;
  birthday: string;
  department: string;
  bankAccount: string;
  bank: string;
  sin: string;
  ptin: string;
  nationalId: string;
  address: string;
  phone: string;
  zaloNo: string;
  email: string;
  hobby: string;
  favoriteSport: string;
  maritalStatus: string;
  dateIn: string;
  specialization: string;
  image?: string;
  // Optional contract fields for creation
  contractNo?: string;
  startDate?: string;
  endDate?: string;
  durationValue?: string;
  durationType?: string;
}

// API base URL - update this to your actual API endpoint
const API_BASE_URL = 'http://localhost:8080/api';

// Transform API response to frontend Employee format
export function transformApiEmployee(apiEmployee: ApiEmployee): Employee {
  return {
    id: apiEmployee.id,
    fullName: apiEmployee.fullName,
    gender: apiEmployee.gender,
    birthday: apiEmployee.birthDay,
    department: apiEmployee.department,
    bankAccount: apiEmployee.bankAccount,
    bank: apiEmployee.bank,
    sin: apiEmployee.sin,
    ptin: apiEmployee.ptin,
    nationalId: apiEmployee.nationalId,
    address: apiEmployee.address,
    phone: apiEmployee.phoneNo,
    zaloNo: apiEmployee.zaloNo,
    email: apiEmployee.email,
    hobby: apiEmployee.hobby,
    favoriteSport: apiEmployee.favoriteSport,
    maritalStatus: apiEmployee.maritalStatus,
    dateIn: apiEmployee.dateIn,
    specialization: apiEmployee.specialization,
    image: apiEmployee.image,
    contractNo: apiEmployee.contractNo,
    startDate: apiEmployee.startDate,
    endDate: apiEmployee.endDate,
    durationValue: apiEmployee.durationValue,
    durationType: apiEmployee.durationType,
  };
}

// Fetch all employees from API
export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiEmployees: ApiEmployee[] = await response.json();
    return apiEmployees.map(transformApiEmployee);
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

// Fetch single employee by ID
export async function fetchEmployeeById(id: string): Promise<Employee | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiEmployee: ApiEmployee = await response.json();
    return transformApiEmployee(apiEmployee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }
}

// Create a new employee with optional image
export async function createEmployee(employee: Partial<ApiEmployee>, imageFile?: File): Promise<Employee> {
  try {
    const formData = new FormData();
    
    // Clean employee data: remove empty strings for optional fields
    const cleanedEmployee = { ...employee };
    // List of optional fields that might be empty strings and cause issues (especially dates/numbers)
    const optionalFields: (keyof ApiEmployee)[] = [
      'contractNo', 'startDate', 'endDate', 'durationValue', 'durationType',
      'image', 'department', 'bankAccount', 'bank', 'sin', 'ptin', 
      'nationalId', 'address', 'phoneNo', 'zaloNo', 'email', 
      'hobby', 'favoriteSport', 'maritalStatus', 'specialization'
    ];

    optionalFields.forEach(field => {
      // @ts-ignore
      if (cleanedEmployee[field] === '') {
        // @ts-ignore
        cleanedEmployee[field] = null;
      }
    });

    // Append employee DTO as JSON blob
    const employeeBlob = new Blob([JSON.stringify(cleanedEmployee)], { type: 'application/json' });
    formData.append('employee', employeeBlob);
    
    // Append image if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      body: formData,
      // Content-Type header should NOT be set manually for FormData; browser sets it with boundary
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiEmployee: ApiEmployee = await response.json();
    return transformApiEmployee(apiEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
}

// Update an existing employee with optional image
export async function updateEmployee(id: string, employee: Partial<ApiEmployee>, imageFile?: File): Promise<Employee> {
  try {
    const formData = new FormData();
    
    // Clean employee data: remove empty strings for optional fields
    const cleanedEmployee = { ...employee };
    const optionalFields: (keyof ApiEmployee)[] = [
      'contractNo', 'startDate', 'endDate', 'durationValue', 'durationType',
      'image', 'department', 'bankAccount', 'bank', 'sin', 'ptin', 
      'nationalId', 'address', 'phoneNo', 'zaloNo', 'email', 
      'hobby', 'favoriteSport', 'maritalStatus', 'specialization'
    ];

    optionalFields.forEach(field => {
      // @ts-ignore
      if (cleanedEmployee[field] === '') {
        // @ts-ignore
        cleanedEmployee[field] = null;
      }
    });

    // Append employee DTO as JSON blob
    const employeeBlob = new Blob([JSON.stringify(cleanedEmployee)], { type: 'application/json' });
    formData.append('employee', employeeBlob);
    
    // Append image if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      body: formData,
      // Content-Type header should NOT be set manually for FormData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiEmployee: ApiEmployee = await response.json();
    return transformApiEmployee(apiEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
}

// Delete an employee
export async function deleteEmployee(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}

// Contract interface matching the backend response
export interface Contract {
  id: string;
  empId: string;
  contractNo: string;
  durationType: string;
  durationValue: string;
  startDate: string;
  endDate: string;
}

// Fetch active contract for an employee
export async function fetchActiveContract(employeeId: string): Promise<Contract | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/contracts/active`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contract: Contract = await response.json();
    return contract;
  } catch (error) {
    console.error('Error fetching active contract:', error);
    return null;
  }
}

// Fetch employee details with active contract
export async function fetchEmployeeWithContract(id: string): Promise<{employee: Employee | null; contract: Contract | null}> {
  const [employee, contract] = await Promise.all([
    fetchEmployeeById(id),
    fetchActiveContract(id)
  ]);
  
  return { employee, contract };
}
