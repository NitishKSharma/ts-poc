import { EmployeeState } from "../employee-state";
import { given } from "@nivinjoseph/n-defensive";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";

export class EmployeeCreated extends DomainEvent<EmployeeState>
{
    private readonly _contactId: string;
    private readonly _firstName: string;
    private readonly _lastName: string;


    public constructor(data: DomainEventData, contactId: string, firstName: string, lastName: string)
    {
        super(data);

        given(contactId, "contactId").ensureHasValue().ensureIsString();
        this._contactId = contactId;

        given(firstName, "firstName").ensureHasValue().ensureIsString();
        this._firstName = firstName;

        given(lastName, "lastName").ensureHasValue().ensureIsString();
        this._lastName = lastName;
    }


    public static deserializeEvent(data: DomainEventData & Serialized): EmployeeCreated
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new EmployeeCreated(data, data.contactId, data.firstName, data.lastName);
    }

    
    protected serializeEvent(): Serialized
    {
        return {
            contactId: this._contactId,
            firstName: this._firstName,
            lastName: this._lastName
        };
    }

    protected applyEvent(state: EmployeeState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.id = this._contactId;
        state.firstName = this._firstName;
        state.lastName = this._lastName;
    }
}


interface Serialized
{
    contactId: string;
    firstName: string;
    lastName: string;
}
