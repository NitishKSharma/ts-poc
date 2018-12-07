import { ContactState } from "../contact-state";
import { given } from "@nivinjoseph/n-defensive";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";

export class ContactSetEmployee extends DomainEvent<ContactState>
{
    public static deserializeEvent(data: DomainEventData): ContactSetEmployee
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new ContactSetEmployee(data);
    }

    
    protected serializeEvent(): object
    {
        return {};
    }
    
    
    protected applyEvent(state: ContactState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.isEmployee = true;
    }    
}
