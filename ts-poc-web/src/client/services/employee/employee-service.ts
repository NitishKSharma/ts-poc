import { Employee } from "../../models/employee";
import { EmployeeEmploymentStatus } from "../../models/employee-employment-status";

export interface EmployeeService
{
    getEmployees(): Promise<ReadonlyArray<Employee>>;
    getEmployee(id: string): Promise<Employee>;
    createEmployee(firstName: string, lastName: string, phone: string, email: string, ssn: number, employeeId: string, employmentStatus: EmployeeEmploymentStatus): Promise<Employee>;
    updateEmployee(id: string, firstName: string, lastName: string, phone: string, email: string, ssn: number, employeeId: string, firingReason: string): Promise<void>;
    hire(id: string): Promise<void>;
    fire(id: string, firingReason: string): Promise<void>;
}