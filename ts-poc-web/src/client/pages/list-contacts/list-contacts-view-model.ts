import { template, route, PageViewModel } from "@nivinjoseph/n-app";
import * as Routes from "../routes";
import "./list-contacts-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { ContactService } from "../../services/contact/contact-service";
import { given } from "@nivinjoseph/n-defensive";
import { Contact } from "../../models/contact";


@template(require("./list-contacts-view.html"))
@route(Routes.listContacts)
@inject("ContactService")
export class ListContactsViewModel extends PageViewModel
{
    private readonly _contactService: ContactService;
    private _contacts: ReadonlyArray<Contact>;

    public get contacts(): ReadonlyArray<Contact> { return this._contacts; }
    
    public constructor(contactService: ContactService)
    {
        super();
        given(contactService, "contactService").ensureHasValue().ensureIsObject();
        this._contactService = contactService;
        this._contacts = [];
    }

    protected onEnter(): void
    {
        this._contactService.getContacts()
            .then(t => this._contacts = t)
            .catch(e => console.log(e));
    }
}