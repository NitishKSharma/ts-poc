import { ContactState } from "../contact-state";
import { given } from "@nivinjoseph/n-defensive";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";

export class ContactEmailUpdated extends DomainEvent<ContactState>
{
    private readonly _email: string;


    public constructor(data: DomainEventData, email: string)
    {
        super(data);
        
        given(email, "email").ensureIsString();
        this._email = email;
    }


    public static deserializeEvent(data: DomainEventData & Serialized): ContactEmailUpdated
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new ContactEmailUpdated(data, data.email);
    }


    protected serializeEvent(): object
    {
        return {
            email: this._email
        };
    }


    protected applyEvent(state: ContactState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.email = this._email;
    }    
}

interface Serialized
{
    email: string;
}