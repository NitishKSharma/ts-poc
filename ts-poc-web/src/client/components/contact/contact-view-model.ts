import { template, element, bind, ComponentViewModel, NavigationService } from "@nivinjoseph/n-app";
import { inject } from "@nivinjoseph/n-ject";
import { ContactService } from "../../services/contact/contact-service";
import { Contact } from "../../models/contact";
import { given } from "@nivinjoseph/n-defensive";
import * as Routes from "../../pages/routes";
import "./contact-view.scss";

@template(require("./contact-view.html"))
@element("contact")
@bind("value")
@inject("ContactService", "NavigationService")
export class ContactViewModel extends ComponentViewModel
{
    private readonly _contactService: ContactService;
    private readonly _navigationService: NavigationService;

    public get contact(): Contact { return this.getBound<Contact>("value"); }

    public constructor(contactService: ContactService, navigationService: NavigationService)
    {
        super();
        given(contactService, "contactService").ensureHasValue().ensureIsObject();
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();

        this._contactService = contactService;
        this._navigationService = navigationService;
    }


    public toggleEmployeeStatus(): void
    {
        if (!this.contact.isEmployee)
        {
            this._contactService.toggleEmployeeStatus(this.contact.id, !this.contact.isEmployee)
                .then(() => this.contact.isEmployee = true)
                .catch(e => console.log(e));
        }
        else
        {
            this._contactService.toggleEmployeeStatus(this.contact.id, !this.contact.isEmployee)
                .then(() => this.contact.isEmployee = false)
                .catch(e => console.log(e));
        }
    }

    public editContact(): void
    {
        this._navigationService.navigate(Routes.manageContacts, { id: this.contact.id });
    }

    public deleteContact(): void
    {
        this._contactService.deleteContact(this.contact.id).then(() => this.contact.isDeleted = true)
            .catch(e => console.log(e));
    }
}