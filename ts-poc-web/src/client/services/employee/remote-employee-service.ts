import { EmployeeService } from "./employee-service";
import { Employee } from "../../models/employee";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import * as Axios from "axios";
import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { inject } from "@nivinjoseph/n-ject";
import { DialogService } from "@nivinjoseph/n-app";
import { EmployeeEmploymentStatus } from "../../models/employee-employment-status";


@inject("DialogService")
export class RemoteEmployeeService implements EmployeeService
{
    private readonly _dialogService: DialogService;
    private readonly _api: Axios.AxiosInstance;


    public constructor(dialogService: DialogService)
    {
        given(dialogService, "dialogService").ensureHasValue().ensureIsObject();

        this._dialogService = dialogService;

        let apiUrl = ConfigurationManager.getConfig<string>("apiUrl").trim();
        if (!apiUrl.endsWith("/"))
            apiUrl += "/";

        this._api = Axios.default.create({
            timeout: 60000,
            baseURL: apiUrl
        });
    }

    public async getEmployees(): Promise<ReadonlyArray<Employee>>
    {
        this._dialogService.showLoadingScreen();

        try
        {
            const response = await this._api.get<ReadonlyArray<Employee>>("api/query/getAllEmployees");
            return response.data.map(t =>
            {
                return t;
            });
        }
        catch (error)
        {
            this.showErrorMessage(error.response.status);
            throw error;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }
    }

    public async getEmployee(id: string): Promise<Employee>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        this._dialogService.showLoadingScreen();
        try
        {
            const response = await this._api.get(`api/query/getEmployee/${id.trim().toLowerCase()}`);
            const contact: Employee = response.data;
            return contact;
        }
        catch (error)
        {
            this.showErrorMessage(error.response.status);
            throw error;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }
    }

    public async createEmployee(firstName: string, lastName: string, phone: string, email: string, ssn: number, employeeId: string, employmentStatus: EmployeeEmploymentStatus): Promise<Employee>
    {
        let _ssn = Number(ssn);
        given(firstName, "firstName").ensureHasValue().ensureIsString();
        given(lastName, "lastName").ensureHasValue().ensureIsString();
        given(phone, "phone").ensureIsString();
        given(email, "email").ensureIsString();
        given(_ssn, "_ssn").ensureIsNumber();
        given(employeeId, "employeeId").ensureIsString();

        const command = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            ssn: _ssn,
            employeeId: employeeId.trim(),
            employmentStatus: employmentStatus,
        };

        this._dialogService.showLoadingScreen();
        try
        {
            const response = await this._api.post("api/command/createEmployee", command);
            this._dialogService.showSuccessMessage("Successfully created employee.");
            const employee: Employee = response.data;
            return employee;
        }
        catch (error)
        {
            this.showErrorMessage(error.response.status);
            throw error;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }
    }

    public async updateEmployee(id: string, firstName: string, lastName: string, phone: string, email: string, ssn: number, employeeId: string, firingReason: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        given(firstName, "firstName").ensureHasValue().ensureIsString();
        given(lastName, "lastName").ensureHasValue().ensureIsString();
        given(phone, "phone").ensureIsNumber();
        given(email, "email").ensureIsString();
        given(ssn, "ssn").ensureIsNumber();
        given(employeeId, "employeeId").ensureIsString();
        given(firingReason, "firingReason").ensureIsString();

        const command = {
            id: id.trim().toLowerCase(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone ? phone.trim() : "",
            email: email ? email.trim() : "",
            ssn: ssn,
            employeeId: employeeId ? employeeId.trim() : "",
            firingReason: firingReason ? firingReason.trim() : "",
        };

        this._dialogService.showLoadingScreen();
        try
        {
            // @ts-ignore
            const response = await this._api.post("api/command/updateEmployee", command);
            this._dialogService.showSuccessMessage("Successfully updated employee.");
        }
        catch (error)
        {
            this.showErrorMessage(error.response.status);
            throw error;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }
    }

    public async hire(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        const command = {
            id: id.trim().toLowerCase()
        };

        this._dialogService.showLoadingScreen();

        try
        {
            // @ts-ignore
            const response = await this._api.post("api/command/hire", command);
            this._dialogService.showSuccessMessage("Successfully hired.");
        }
        catch (error)
        {
            this.showErrorMessage(error.response.status);
            throw error;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }
    }

    public async fire(id: string, firingReason: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        const command = {
            id: id.trim().toLowerCase(),
            firingReason: firingReason.trim().toLocaleLowerCase()
        };

        this._dialogService.showLoadingScreen();

        try
        {
            // @ts-ignore
            const response = await this._api.post("api/command/fire", command);
            this._dialogService.showSuccessMessage("Successfully fired.");
        }
        catch (error)
        {
            this.showErrorMessage(error.response.status);
            throw error;
        }
        finally
        {
            this._dialogService.hideLoadingScreen();
        }
    }

    
    private showErrorMessage(status: number): void
    {
        this._dialogService.showErrorMessage(`There was an error while processing your request. Code ${status}.`);
    }
}