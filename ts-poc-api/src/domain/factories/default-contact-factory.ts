import { ContactFactory } from "./contact-factory";
import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { Contact } from "../aggregates/contact/contact";
import { ContactCreated } from "../aggregates/contact/events/contact-created";
import { ContactRepository } from "../repositories/contact-repository";
import { inject } from "@nivinjoseph/n-ject";
import { DomainContext, DomainHelper } from "@nivinjoseph/n-domain";
import { isPhoneNumber } from "@nivinjoseph/n-validate/dist/string-validation/is-phone-number";

@inject("DomainContext", "ContactRepository")
export class DefaultContactFactory implements ContactFactory
{
    private readonly _domainContext: DomainContext;
    private readonly _contactRepo: ContactRepository;

    public constructor(domainContext: DomainContext, contactRepo: ContactRepository)
    {
        given(domainContext, "domainContext").ensureHasValue().ensureIsObject();
        this._domainContext = domainContext;

        given(contactRepo, "contactRepo").ensureHasValue().ensureIsObject();
        this._contactRepo = contactRepo;
    }

    public async create(fullName: string, email: string, phone: number): Promise<Contact>
    {
        given(fullName, "fullName").ensureHasValue().ensureIsString();
        given(email, "email").ensureIsString();
        given(phone, "phone").ensureIsNumber();

        const event = new ContactCreated({}, DomainHelper.generateId(), fullName, phone, email);
        const contact = new Contact(this._domainContext, [event]);
        await this._contactRepo.save(contact);
        return await this._contactRepo.get(contact.id);
    }
}