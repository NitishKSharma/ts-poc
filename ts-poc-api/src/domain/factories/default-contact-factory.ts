import { ContactFactory } from "./contact-factory";
import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { Contact } from "../aggregates/contact/contact";
import { ContactCreated } from "../aggregates/contact/events/contact-created";
import { ContactRepository } from "../repositories/contact-repository";
import { inject } from "@nivinjoseph/n-ject";
import { DomainContext, DomainHelper } from "@nivinjoseph/n-domain";

@inject("DomainContext", "ContactRepository")
export class DefaultContactFactory implements ContactFactory
{
    private readonly _domainContext: DomainContext;
    private readonly _contactRepository: ContactRepository;

    public constructor(domainContext: DomainContext, contactRepository: ContactRepository)
    {
        given(domainContext, "domainContext").ensureHasValue().ensureIsObject();
        this._domainContext = domainContext;

        given(contactRepository, "contactRepository").ensureHasValue().ensureIsObject();
        this._contactRepository = contactRepository;
    }

    public async create(fullName: string, phone: number, email: string): Promise<Contact>
    {
        given(fullName, "fullName").ensureHasValue().ensureIsString();
        given(email, "email").ensureIsString();
        given(phone, "phone").ensureIsNumber();

        const event = new ContactCreated({}, DomainHelper.generateId(), fullName, phone, email);
        const contact = new Contact(this._domainContext, [event]);
        await this._contactRepository.save(contact);
        return await this._contactRepository.get(contact.id);
    }
}