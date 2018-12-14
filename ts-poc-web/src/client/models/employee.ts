import { EmployeeEmploymentStatus } from "./employee-employment-status";

export interface Employee
{
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    ssn: number;
    employeeId: string;
    employmentStatus: EmployeeEmploymentStatus;
    firingReason: string;
}