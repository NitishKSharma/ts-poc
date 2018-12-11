import { PageViewModel, template, route, NavigationService } from "@nivinjoseph/n-app";
import * as Routes from "../routes";
import "./manage-contact-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { ContactService } from "../../services/contact/contact-service";
import { given } from "@nivinjoseph/n-defensive";


@template(require("./manage-contact-view.html"))
@route(Routes.manageContacts)
@inject("ContactService", "NavigationService")
export class ManageContactViewModel extends PageViewModel
{
    private readonly _contactService: ContactService;
    private readonly _navigationService: NavigationService;
    private _operation: string;
    private _id: string | null;
    private _fullName: string;
    private _phone: number;
    private _email: string;


    public get operation(): string { return this._operation; }

    public get fullName(): string { return this._fullName; }
    public set fullName(value: string) { this._fullName = value; }

    public get phone(): number { return this._phone; }
    public set phone(value: number) { this._phone = value; }

    public get email(): string { return this._email; }
    public set email(value: string) { this._email = value; }

    public constructor(contactService: ContactService, navigationService: NavigationService)
    {
        super();
        given(contactService, "contactService").ensureHasValue().ensureIsObject();
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();

        this._contactService = contactService;
        this._navigationService = navigationService;
        this._operation = "";
        this._id = null;
        this._fullName = "";
        this._phone = 0;
        this._email = "";
    }


    public save(): void
    {        
        const savePromise: Promise<any> = this._id ? this._contactService.updateContact(this._id, this._fullName, this._phone, this._email) :
            this._contactService.createContact(this._fullName, this._phone, this._email);

        savePromise.then(() => this._navigationService.navigate(Routes.listContacts, {})).catch(e => console.log(e));
    }


    protected onEnter(id?: string): void
    {
        if (id && !id.isEmptyOrWhiteSpace())
        {
            this._operation = "Update";

            this._contactService.getContact(id)
                .then(t =>
                {
                    this._id = t.id;
                    this._fullName = t.fullName;
                    this._phone = t.phone;
                    this._email = t.email;
                })
                .catch(e => console.log(e));
        }
        else
        {
            this._operation = "Add";
        }
    }
}