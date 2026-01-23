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
  department: string;
  accountNo: string;
  bankAccount: string;
  bank: string;
  sin: string;
  ptin: string;
  hobby: string;
  favoriteSport: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  contractStartDate: string;
  contractEndDate: string;
  contractDuration: string;
  specialization: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  dateJoined: string;
  salary: number;
  manager?: string;
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'HR Manager' | 'Manager' | 'Employee';
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export const mockEmployees: Employee[] = [
  {
    id: '1',
    contractNo: 'C001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    gender: 'Female',
    birthday: '1985-05-15',
    nationalId: 'N001',
    address: '123 Main St, City, Country',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    zaloNumber: 'Z001',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    accountNo: 'A001',
    bankAccount: 'B001',
    bank: 'Bank A',
    sin: '123-456-789',
    ptin: '987-654-321',
    hobby: 'Reading',
    favoriteSport: 'Tennis',
    maritalStatus: 'Single',
    contractStartDate: '2022-01-15',
    contractEndDate: '2027-01-15',
    contractDuration: '5 years',
    specialization: 'Full Stack Development',
    status: 'Active',
    dateJoined: '2022-01-15',
    salary: 125000,
    manager: 'Michael Chen'
  },
  {
    id: '2',
    contractNo: 'C002',
    firstName: 'Michael',
    lastName: 'Chen',
    gender: 'Male',
    birthday: '1978-08-20',
    nationalId: 'N002',
    address: '456 Elm St, City, Country',
    email: 'michael.chen@company.com',
    phone: '+1 (555) 234-5678',
    zaloNumber: 'Z002',
    position: 'Engineering Manager',
    department: 'Engineering',
    accountNo: 'A002',
    bankAccount: 'B002',
    bank: 'Bank B',
    sin: '234-567-890',
    ptin: '890-123-456',
    hobby: 'Gaming',
    favoriteSport: 'Basketball',
    maritalStatus: 'Married',
    contractStartDate: '2020-03-10',
    contractEndDate: '2025-03-10',
    contractDuration: '5 years',
    specialization: 'Project Management',
    status: 'Active',
    dateJoined: '2020-03-10',
    salary: 150000
  },
  {
    id: '3',
    contractNo: 'C003',
    firstName: 'Emma',
    lastName: 'Williams',
    gender: 'Female',
    birthday: '1990-03-10',
    nationalId: 'N003',
    address: '789 Oak St, City, Country',
    email: 'emma.williams@company.com',
    phone: '+1 (555) 345-6789',
    zaloNumber: 'Z003',
    position: 'Product Designer',
    department: 'Design',
    accountNo: 'A003',
    bankAccount: 'B003',
    bank: 'Bank C',
    sin: '345-678-901',
    ptin: '789-012-345',
    hobby: 'Photography',
    favoriteSport: 'Swimming',
    maritalStatus: 'Single',
    contractStartDate: '2021-06-20',
    contractEndDate: '2026-06-20',
    contractDuration: '5 years',
    specialization: 'UI/UX Design',
    status: 'Active',
    dateJoined: '2021-06-20',
    salary: 95000,
    manager: 'Lisa Anderson'
  },
  {
    id: '4',
    contractNo: 'C004',
    firstName: 'James',
    lastName: 'Brown',
    gender: 'Male',
    birthday: '1982-11-05',
    nationalId: 'N004',
    address: '101 Pine St, City, Country',
    email: 'james.brown@company.com',
    phone: '+1 (555) 456-7890',
    zaloNumber: 'Z004',
    position: 'Marketing Specialist',
    department: 'Marketing',
    accountNo: 'A004',
    bankAccount: 'B004',
    bank: 'Bank D',
    sin: '456-789-012',
    ptin: '678-901-234',
    hobby: 'Cooking',
    favoriteSport: 'Football',
    maritalStatus: 'Married',
    contractStartDate: '2023-02-01',
    contractEndDate: '2028-02-01',
    contractDuration: '5 years',
    specialization: 'Digital Marketing',
    status: 'Active',
    dateJoined: '2023-02-01',
    salary: 75000,
    manager: 'Robert Taylor'
  },
  {
    id: '5',
    contractNo: 'C005',
    firstName: 'Lisa',
    lastName: 'Anderson',
    gender: 'Female',
    birthday: '1988-07-15',
    nationalId: 'N005',
    address: '202 Maple St, City, Country',
    email: 'lisa.anderson@company.com',
    phone: '+1 (555) 567-8901',
    zaloNumber: 'Z005',
    position: 'Design Lead',
    department: 'Design',
    accountNo: 'A005',
    bankAccount: 'B005',
    bank: 'Bank E',
    sin: '567-890-123',
    ptin: '567-890-123',
    hobby: 'Traveling',
    favoriteSport: 'Volleyball',
    maritalStatus: 'Divorced',
    contractStartDate: '2019-09-15',
    contractEndDate: '2024-09-15',
    contractDuration: '5 years',
    specialization: 'Design Leadership',
    status: 'Active',
    dateJoined: '2019-09-15',
    salary: 135000
  },
  {
    id: '6',
    contractNo: 'C006',
    firstName: 'David',
    lastName: 'Martinez',
    gender: 'Male',
    birthday: '1992-04-25',
    nationalId: 'N006',
    address: '303 Cedar St, City, Country',
    email: 'david.martinez@company.com',
    phone: '+1 (555) 678-9012',
    zaloNumber: 'Z006',
    position: 'Software Engineer',
    department: 'Engineering',
    accountNo: 'A006',
    bankAccount: 'B006',
    bank: 'Bank F',
    sin: '678-901-234',
    ptin: '456-789-012',
    hobby: 'Gardening',
    favoriteSport: 'Tennis',
    maritalStatus: 'Single',
    contractStartDate: '2022-11-05',
    contractEndDate: '2027-11-05',
    contractDuration: '5 years',
    specialization: 'Backend Development',
    status: 'Active',
    dateJoined: '2022-11-05',
    salary: 105000,
    manager: 'Michael Chen'
  },
  {
    id: '7',
    contractNo: 'C007',
    firstName: 'Jennifer',
    lastName: 'Garcia',
    gender: 'Female',
    birthday: '1980-09-30',
    nationalId: 'N007',
    address: '404 Birch St, City, Country',
    email: 'jennifer.garcia@company.com',
    phone: '+1 (555) 789-0123',
    zaloNumber: 'Z007',
    position: 'HR Manager',
    department: 'Human Resources',
    accountNo: 'A007',
    bankAccount: 'B007',
    bank: 'Bank G',
    sin: '789-012-345',
    ptin: '345-678-901',
    hobby: 'Painting',
    favoriteSport: 'Badminton',
    maritalStatus: 'Widowed',
    contractStartDate: '2021-04-12',
    contractEndDate: '2026-04-12',
    contractDuration: '5 years',
    specialization: 'Human Resource Management',
    status: 'Active',
    dateJoined: '2021-04-12',
    salary: 95000
  },
  {
    id: '8',
    contractNo: 'C008',
    firstName: 'Robert',
    lastName: 'Taylor',
    gender: 'Male',
    birthday: '1975-01-10',
    nationalId: 'N008',
    address: '505 Willow St, City, Country',
    email: 'robert.taylor@company.com',
    phone: '+1 (555) 890-1234',
    zaloNumber: 'Z008',
    position: 'Marketing Director',
    department: 'Marketing',
    accountNo: 'A008',
    bankAccount: 'B008',
    bank: 'Bank H',
    sin: '890-123-456',
    ptin: '234-567-890',
    hobby: 'Hiking',
    favoriteSport: 'Soccer',
    maritalStatus: 'Single',
    contractStartDate: '2020-07-20',
    contractEndDate: '2025-07-20',
    contractDuration: '5 years',
    specialization: 'Marketing Strategy',
    status: 'Active',
    dateJoined: '2020-07-20',
    salary: 145000
  },
  {
    id: '9',
    contractNo: 'C009',
    firstName: 'Amanda',
    lastName: 'White',
    gender: 'Female',
    birthday: '1995-06-20',
    nationalId: 'N009',
    address: '606 Walnut St, City, Country',
    email: 'amanda.white@company.com',
    phone: '+1 (555) 901-2345',
    zaloNumber: 'Z009',
    position: 'Sales Representative',
    department: 'Sales',
    accountNo: 'A009',
    bankAccount: 'B009',
    bank: 'Bank I',
    sin: '901-234-567',
    ptin: '123-456-789',
    hobby: 'Photography',
    favoriteSport: 'Golf',
    maritalStatus: 'Single',
    contractStartDate: '2023-01-10',
    contractEndDate: '2028-01-10',
    contractDuration: '5 years',
    specialization: 'Sales Strategy',
    status: 'On Leave',
    dateJoined: '2023-01-10',
    salary: 65000,
    manager: 'Christopher Lee'
  },
  {
    id: '10',
    contractNo: 'C010',
    firstName: 'Christopher',
    lastName: 'Lee',
    gender: 'Male',
    birthday: '1987-12-05',
    nationalId: 'N010',
    address: '707 Poplar St, City, Country',
    email: 'christopher.lee@company.com',
    phone: '+1 (555) 012-3456',
    zaloNumber: 'Z010',
    position: 'Sales Manager',
    department: 'Sales',
    accountNo: 'A010',
    bankAccount: 'B010',
    bank: 'Bank J',
    sin: '012-345-678',
    ptin: '876-543-210',
    hobby: 'Reading',
    favoriteSport: 'Tennis',
    maritalStatus: 'Married',
    contractStartDate: '2019-05-08',
    contractEndDate: '2024-05-08',
    contractDuration: '5 years',
    specialization: 'Sales Leadership',
    status: 'Active',
    dateJoined: '2019-05-08',
    salary: 125000
  },
  {
    id: '11',
    contractNo: 'C011',
    firstName: 'Jessica',
    lastName: 'Thompson',
    gender: 'Female',
    birthday: '1991-08-15',
    nationalId: 'N011',
    address: '808 Ash St, City, Country',
    email: 'jessica.thompson@company.com',
    phone: '+1 (555) 123-4568',
    zaloNumber: 'Z011',
    position: 'QA Engineer',
    department: 'Engineering',
    accountNo: 'A011',
    bankAccount: 'B011',
    bank: 'Bank K',
    sin: '123-456-789',
    ptin: '987-654-321',
    hobby: 'Cooking',
    favoriteSport: 'Basketball',
    maritalStatus: 'Single',
    contractStartDate: '2022-08-15',
    contractEndDate: '2027-08-15',
    contractDuration: '5 years',
    specialization: 'Quality Assurance',
    status: 'Active',
    dateJoined: '2022-08-15',
    salary: 85000,
    manager: 'Michael Chen'
  },
  {
    id: '12',
    contractNo: 'C012',
    firstName: 'Daniel',
    lastName: 'Wilson',
    gender: 'Male',
    birthday: '1989-03-25',
    nationalId: 'N012',
    address: '909 Spruce St, City, Country',
    email: 'daniel.wilson@company.com',
    phone: '+1 (555) 234-5679',
    zaloNumber: 'Z012',
    position: 'DevOps Engineer',
    department: 'Engineering',
    accountNo: 'A012',
    bankAccount: 'B012',
    bank: 'Bank L',
    sin: '234-567-890',
    ptin: '890-123-456',
    hobby: 'Gaming',
    favoriteSport: 'Football',
    maritalStatus: 'Married',
    contractStartDate: '2021-12-01',
    contractEndDate: '2026-12-01',
    contractDuration: '5 years',
    specialization: 'DevOps',
    status: 'Active',
    dateJoined: '2021-12-01',
    salary: 115000,
    manager: 'Michael Chen'
  }
];

export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    manager: 'Michael Chen',
    employeeCount: 5,
    description: 'Software development and technical infrastructure'
  },
  {
    id: '2',
    name: 'Design',
    manager: 'Lisa Anderson',
    employeeCount: 2,
    description: 'Product design and user experience'
  },
  {
    id: '3',
    name: 'Marketing',
    manager: 'Robert Taylor',
    employeeCount: 2,
    description: 'Marketing campaigns and brand management'
  },
  {
    id: '4',
    name: 'Sales',
    manager: 'Christopher Lee',
    employeeCount: 2,
    description: 'Sales operations and customer acquisition'
  },
  {
    id: '5',
    name: 'Human Resources',
    manager: 'Jennifer Garcia',
    employeeCount: 1,
    description: 'Employee relations and talent management'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2026-01-05 09:30 AM'
  },
  {
    id: '2',
    name: 'Jennifer Garcia',
    email: 'jennifer.garcia@company.com',
    role: 'HR Manager',
    status: 'Active',
    lastLogin: '2026-01-05 08:15 AM'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2026-01-04 05:45 PM'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Employee',
    status: 'Active',
    lastLogin: '2026-01-05 10:00 AM'
  }
];