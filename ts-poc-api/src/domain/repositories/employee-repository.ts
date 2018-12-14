import { Employee } from "../aggregates/employee/employee";


export interface EmployeeRepository
{
    getAll(): Promise<ReadonlyArray<Employee>>;
    get(id: string): Promise<Employee>;
    save(employee: Employee): Promise<void>;
    delete(id: string): Promise<void>;
}