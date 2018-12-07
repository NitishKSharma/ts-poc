import { ContactRepository } from "../../domain/repositories/contact-repository";
import { given } from "@nivinjoseph/n-defensive";
import { Contact } from "../../domain/aggregates/contact/contact";
import { ContactNotFoundException } from "../../domain/exceptions/contact-not-found-exception";
import { inject } from "@nivinjoseph/n-ject";
import { DomainContext } from "@nivinjoseph/n-domain";

@inject("DomainContext")
export class InMemoryContactRepository implements ContactRepository
{
    private readonly _domainContext: DomainContext;
    private readonly _contacts: { [index: string]: StorageModel };


    public constructor(domainContext: DomainContext)
    {
        given(domainContext, "domainContext").ensureHasValue().ensureIsObject();
        this._domainContext = domainContext;

        this._contacts = {};
    }


    public getAll(): Promise<ReadonlyArray<Contact>>
    {
        const result = new Array<Contact>();

        for (const key in this._contacts)
        {
            result.push(Contact.deserialize(this._domainContext, this._contacts[key].data));
        }

        return Promise.resolve(result.orderByDesc(t => t.updatedAt));
    }

    public get(id: string): Promise<Contact>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        if (!this._contacts[id])
            return Promise.reject(new ContactNotFoundException(id));
        
        const result = Contact.deserialize(this._domainContext, this._contacts[id].data);
        return Promise.resolve(result);
    }

    public save(contact: Contact): Promise<void>
    {
        given(contact, "contact").ensureHasValue().ensureIsType(Contact);

        const data: any = contact.serialize();

        const storageEntity: StorageModel = {
            id: contact.id,
            version: contact.currentVersion,
            updatedAt: contact.updatedAt,
            data,
            query: data.$state
        };

        console.log(JSON.stringify(storageEntity));

        this._contacts[contact.id] = storageEntity;

        return Promise.resolve();
    }

    public delete(id: string): Promise<void>
    {
        given(id, "string").ensureHasValue().ensureIsString();

        if (this._contacts[id])
            delete this._contacts[id];

        return Promise.resolve();
    }
}

interface StorageModel
{
    id: string;
    version: number;
    updatedAt: number;
    data: object;
    query: object;
}