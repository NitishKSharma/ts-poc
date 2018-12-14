import { Employee } from "../aggregates/employee/employee";


export interface EmployeeFactory
{
    create(fullName: string, lastName: string): Promise<Employee>;
}