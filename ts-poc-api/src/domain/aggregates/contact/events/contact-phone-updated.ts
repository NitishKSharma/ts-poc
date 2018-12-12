import { ContactState } from "../contact-state";
import { given } from "@nivinjoseph/n-defensive";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";

export class ContactPhoneUpdated extends DomainEvent<ContactState>
{
    private readonly _phone: number;


    public constructor(data: DomainEventData, phone: number)
    {
        super(data);

        given(phone, "phone").ensureIsNumber();
        this._phone = phone;
    }


    public static deserializeEvent(data: DomainEventData & Serialized): ContactPhoneUpdated
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new ContactPhoneUpdated(data, data.phone);
    }


    protected serializeEvent(): object
    {
        return {
            phone: this._phone
        };
    }


    protected applyEvent(state: ContactState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.phone = this._phone;
    }
}


interface Serialized
{
    phone: number;
}