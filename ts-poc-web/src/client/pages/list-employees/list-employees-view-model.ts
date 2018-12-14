import { template, route, PageViewModel } from "@nivinjoseph/n-app";
import * as Routes from "../routes";
import "./list-employees-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { EmployeeService } from "../../services/employee/employee-service";
import { given } from "@nivinjoseph/n-defensive";
import { Employee } from "../../models/employee";


@template(require("./list-employees-view.html"))
@route(Routes.listEmployees)
@inject("EmployeeService")
export class ListEmployeesViewModel extends PageViewModel
{
    private readonly _employeeService: EmployeeService;
    private _employees: ReadonlyArray<Employee>;

    public get employees(): ReadonlyArray<Employee> { return this._employees; }

    
    public constructor(employeeService: EmployeeService)
    {
        super();
        given(employeeService, "employeeService").ensureHasValue().ensureIsObject();
        this._employeeService = employeeService;
        this._employees = [];
    }


    protected onEnter(): void
    {
        this._employeeService.getEmployees()
            .then(t => this._employees = t)
            .catch(e => console.log(e));
    }
}