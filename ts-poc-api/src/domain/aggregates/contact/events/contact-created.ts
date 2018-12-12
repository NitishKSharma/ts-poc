import { ContactState } from "../contact-state";
import { given } from "@nivinjoseph/n-defensive";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";

export class ContactCreated extends DomainEvent<ContactState>
{
    private readonly _contactId: string;
    private readonly _fullName: string;


    public constructor(data: DomainEventData, contactId: string, fullName: string)
    {
        super(data);

        given(contactId, "contactId").ensureHasValue().ensureIsString();
        this._contactId = contactId;

        given(fullName, "fullName").ensureHasValue().ensureIsString();
        this._fullName = fullName;
    }


    public static deserializeEvent(data: DomainEventData & Serialized): ContactCreated
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new ContactCreated(data, data.contactId, data.fullName);
    }

    
    protected serializeEvent(): Serialized
    {
        return {
            contactId: this._contactId,
            fullName: this._fullName,
        };
    }

    protected applyEvent(state: ContactState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.id = this._contactId;
        state.fullName = this._fullName;
    }
}


interface Serialized
{
    contactId: string;
    fullName: string;
}
