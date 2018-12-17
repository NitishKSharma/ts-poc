import { template, route, PageViewModel, NavigationService } from "@nivinjoseph/n-app";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { EmployeeService } from "../../services/employee/employee-service";
import { EmployeeEmploymentStatus } from "../../models/employee-employment-status";
import { given } from "@nivinjoseph/n-defensive";
import "./show-employee-view.scss";


@template(require("./show-employee-view.html"))
@route(Routes.showEmployee)
@inject("EmployeeService", "NavigationService")
export class ShowEmployeeViewModel extends PageViewModel
{
    private readonly _employeeService: EmployeeService;
    private readonly _navigationService: NavigationService;
    private _id: string | null;
    private _firstName: string;
    private _lastName: string;
    private _phone: string;
    private _email: string;
    private _ssn: number;
    private _employeeId: string;
    private _firingReason: string;
    private _employmentStatus: EmployeeEmploymentStatus;
    private _employmentStatusString: string;
    private _showFireForm: boolean;

    public get firstName(): string { return this._firstName; }
    public set firstName(value: string) { this._firstName = value; }

    public get lastName(): string { return this._lastName; }
    public set lastName(value: string) { this._lastName = value; }

    public get phone(): string { return this._phone; }
    public set phone(value: string) { this._phone = value; }

    public get email(): string { return this._email; }
    public set email(value: string) { this._email = value; }

    public get ssn(): number { return this._ssn; }
    public set ssn(value: number) { this._ssn = value; }

    public get employeeId(): string { return this._employeeId; }
    public set employeeId(value: string) { this._employeeId = value; }

    public get firingReason(): string { return this._firingReason; }
    public set firingReason(value: string) { this._firingReason = value; }

    public get employmentStatus(): EmployeeEmploymentStatus { return this._employmentStatus; }
    public set employmentStatus(value: EmployeeEmploymentStatus)
    {
        this._employmentStatus = value;
        if (this._employmentStatus === EmployeeEmploymentStatus.employee)
        {
            this.employmentStatusString = "Employee";
        }
        else
        {
            this.employmentStatusString = "Not an employee";
        }
    }

    public get employmentStatusString(): string { return this._employmentStatusString; }
    public set employmentStatusString(value: string) { this._employmentStatusString = value; }

    public get showFireForm(): boolean { return this._showFireForm; }
    public set showFireForm(value: boolean) { this._showFireForm = value; }

    public constructor(employeeService: EmployeeService, navigationService: NavigationService)
    {
        super();
        given(employeeService, "contactService").ensureHasValue().ensureIsObject();
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();

        this._employeeService = employeeService;
        this._navigationService = navigationService;
        this._id = null;
        this._firstName = "";
        this._lastName = "";
        this._phone = "";
        this._email = "";
        this._ssn = 0;
        this._employeeId = "";
        this._employmentStatus = EmployeeEmploymentStatus.notAnEmployee;
        this._employmentStatusString = "";        
    }


    public editEmployee(): void
    {
        this._navigationService.navigate(Routes.manageEmployees, { id: this._id });
    }


    public hire(): void
    {
        this._employeeService.hire(this._id);
        this.employmentStatus = EmployeeEmploymentStatus.employee;
    }

    public startFire(): void
    {
        this.showFireForm = true;
    }

    public fire(): void
    {
        this._employeeService.fire(this._id, this._firingReason);
    }

    protected onEnter(id: string): void
    {
        this._employeeService.getEmployee(id)
            .then(t =>
            {
                this._id = t.id;
                this._firstName = t.firstName;
                this._lastName = t.lastName;
                this._phone = t.phone;
                this._email = t.email;
                this._ssn = t.ssn;
                this._employeeId = t.employeeId;
                this._employmentStatus = t.employmentStatus;
                this._firingReason = t.firingReason;
            });

    }
}