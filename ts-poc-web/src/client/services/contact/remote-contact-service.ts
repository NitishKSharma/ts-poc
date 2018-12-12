import { ContactService } from "./contact-service";
import { Contact } from "../../models/contact";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import * as Axios from "axios";
import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { inject } from "@nivinjoseph/n-ject";
import { DialogService } from "@nivinjoseph/n-app";
import { isNumber } from "util";

@inject("DialogService")
export class RemoteContactService implements ContactService
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

    public async getContacts(): Promise<ReadonlyArray<Contact>>
    {
        this._dialogService.showLoadingScreen();

        try
        {
            const response = await this._api.get<ReadonlyArray<Contact>>("api/query/getAllContacts");
            return response.data.map(t =>
            {
                t.isDeleted = false;
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

    public async getContact(id: string): Promise<Contact>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        this._dialogService.showLoadingScreen();
        try
        {
            const response = await this._api.get(`api/query/getContact/${id.trim().toLowerCase()}`);
            const contact: Contact = response.data;
            contact.isDeleted = false;
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

    public async createContact(fullName: string, phone: number, email: string): Promise<Contact>
    {        
        let _phone = Number(phone);        
        given(fullName, "fullName").ensureHasValue().ensureIsString();
        given(_phone, "_phone").ensureIsNumber();
        given(email, "email").ensureIsString();
        
        const command = {
            fullName: fullName.trim(),
            phone: _phone,
            email: email.trim()
        };

        this._dialogService.showLoadingScreen();
        try
        {
            const response = await this._api.post("api/command/createContact", command);
            this._dialogService.showSuccessMessage("Successfully created contact.");
            const contact: Contact = response.data;
            contact.isDeleted = false;
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

    public async updateContact(id: string, fullName: string, phone: number, email: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();
        given(fullName, "fullName").ensureHasValue().ensureIsString();
        given(phone, "phone").ensureIsNumber();
        given(email, "email").ensureIsString();
        const command = {
            id: id.trim().toLowerCase(),
            fullName: fullName.trim(),
            phone: phone,
            email: email ? email.trim() : ""
        };

        this._dialogService.showLoadingScreen();
        try
        {
            // @ts-ignore
            const response = await this._api.post("api/command/updateContact", command);
            this._dialogService.showSuccessMessage("Successfully updated contact.");
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

    public async toggleEmployeeStatus(id: string, employeeStatus: boolean): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        const command = {
            id: id.trim().toLowerCase()
        };

        this._dialogService.showLoadingScreen();

        try
        {
            if (employeeStatus)
            {
                // @ts-ignore
                const response = await this._api.post("api/command/setContactEmployee", command);
                this._dialogService.showSuccessMessage("Successfully hired.");
            }
            else
            {
                // @ts-ignore
                const response = await this._api.post("api/command/unSetContactEmployee", command);
                this._dialogService.showSuccessMessage("Successfully fired.");
            }
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

    public async deleteContact(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        const command = {
            id: id.trim().toLowerCase()
        };


        this._dialogService.showLoadingScreen();

        try
        {
            // @ts-ignore
            const response = await this._api.post("api/command/deleteContact", command);
            this._dialogService.showSuccessMessage("Successfully deleted contact");
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