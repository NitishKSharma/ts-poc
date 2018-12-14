import { EmployeeFactory } from "./employee-factory";
import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { Employee } from "../aggregates/employee/employee";
import { EmployeeCreated } from "../aggregates/employee/events/employee-created";
import { EmployeeRepository } from "../repositories/employee-repository";
import { inject } from "@nivinjoseph/n-ject";
import { DomainContext, DomainHelper } from "@nivinjoseph/n-domain";

@inject("DomainContext", "EmployeeRepository")
export class DefaultEmployeeFactory implements EmployeeFactory
{
    private readonly _domainContext: DomainContext;
    private readonly _employeeRepository: EmployeeRepository;


    public constructor(domainContext: DomainContext, employeeRepository: EmployeeRepository)
    {
        given(domainContext, "domainContext").ensureHasValue().ensureIsObject();
        this._domainContext = domainContext;

        given(employeeRepository, "employeeRepository").ensureHasValue().ensureIsObject();
        this._employeeRepository = employeeRepository;
    }

    
    public async create(firstName: string, lastName: string): Promise<Employee>
    {        
        given(firstName, "fullName").ensureHasValue().ensureIsString();
        given(lastName, "lastName").ensureHasValue().ensureIsString();

        const event = new EmployeeCreated({}, DomainHelper.generateId(), firstName, lastName);
        const employee = new Employee(this._domainContext, [event]);
        await this._employeeRepository.save(employee);
        return await this._employeeRepository.get(employee.id);
    }
}