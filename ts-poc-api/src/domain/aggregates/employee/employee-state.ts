import { AggregateState } from "@nivinjoseph/n-domain";
import { EmployeeEmploymentStatus } from "./value-objects/employee-employment-status";
// import { Address } from "./value-objects/address";


export interface EmployeeState extends AggregateState
{    
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    ssn: number;
    employeeId: string;
    employmentStatus: EmployeeEmploymentStatus;
    firingReason: string;    
}