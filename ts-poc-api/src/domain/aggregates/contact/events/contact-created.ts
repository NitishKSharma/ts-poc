import { ContactState } from "../contact-state";
import { given } from "@nivinjoseph/n-defensive";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";

export class ContactCreated extends DomainEvent<ContactState>
{
    private readonly _contactId: string;
    private readonly _fullName: string;
    private readonly _phone: number;
    private readonly _email: string;

    public constructor(data: DomainEventData, contactId: string, fullName: string, phone: number, email: string)
    {
        super(data);

        given(contactId, "contactId").ensureHasValue().ensureIsString();
        this._contactId = contactId;

        given(fullName, "fullName").ensureHasValue().ensureIsString();
        this._fullName = fullName;

        given(phone, "phone").ensureHasValue().ensureIsNumber();
        this._phone = phone;

        given(email, "email").ensureHasValue().ensureIsString();
        this._email = email;
    }

    public static deserializeEvent(data: DomainEventData & Serialized): ContactCreated
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new ContactCreated(data, data.contactId, data.fullName, data.phone, data.email);
    }

    protected serializeEvent(): Serialized
    {
        return {
            contactId: this._contactId,
            fullName: this._fullName,
            phone: this._phone,
            email: this._email
        };
    }

    protected applyEvent(state: ContactState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.id = this._contactId;
        state.fullName = this._fullName;
        state.phone = this._phone;
        state.email = this._email;
    }
}

interface Serialized
{
    contactId: string;
    fullName: string;
    phone: number;
    email: string;
}
