import { ContactState } from "../contact-state";
import { given } from "@nivinjoseph/n-defensive";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";

export class ContactUnSetEmployee extends DomainEvent<ContactState>
{
    public static deserializeEvent(data: DomainEventData): ContactUnSetEmployee
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new ContactUnSetEmployee(data);
    }


    protected serializeEvent(): object
    {
        return {};
    }


    protected applyEvent(state: ContactState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.isEmployee = false;
    }
}
