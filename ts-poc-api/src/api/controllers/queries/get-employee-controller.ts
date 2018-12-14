import { Controller, route, query } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { EmployeeRepository } from "../../../domain/repositories/employee-repository";
import { given } from "@nivinjoseph/n-defensive";

@route(Routes.query.getEmployee)
@query
@inject("EmployeeRepository")
export class GetEmployeeController extends Controller 
{
    private readonly _employeeRepository: EmployeeRepository;

    public constructor(employeeRepository: EmployeeRepository)
    {
        super();
        given(employeeRepository, "employeeRepository").ensureHasValue().ensureIsObject();
        this._employeeRepository = employeeRepository;
    }


    public async execute(id: string): Promise<object>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        const employee = await this._employeeRepository.get(id);

        return {
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            phone: employee.phone,
            email: employee.email,
            ssn: employee.ssn,
            employeeId: employee.employeeId,
            employmentStatus: employee.employmentStatus,
            firingReason: employee.firingReason,
        };
    }
}