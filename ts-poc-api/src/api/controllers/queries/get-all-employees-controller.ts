import { Controller, route, query } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { EmployeeRepository } from "../../../domain/repositories/employee-repository";
import { given } from "@nivinjoseph/n-defensive";

@route(Routes.query.getAllEmployees)
@query
@inject("EmployeeRepository")
export class GetAllEmployeesController extends Controller
{
    private readonly _employeeRepository: EmployeeRepository;


    public constructor(employeeRepository: EmployeeRepository)
    {
        super();
        given(employeeRepository, "employeeRepository").ensureHasValue().ensureIsObject();
        this._employeeRepository = employeeRepository;
    }


    public async execute(): Promise<ReadonlyArray<object>>
    {
        const employees = await this._employeeRepository.getAll();
        return employees.map(t => (
            {
                id: t.id,
                firstName: t.firstName,
                lastName: t.lastName,                
                phone: t.phone,
                email: t.email,
                ssn: t.ssn,
                employeeId: t.employeeId,
                employmentStatus: t.employmentStatus,
                firingReason: t.firingReason,                
            }
        ));
    }
}