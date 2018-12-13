import { EmployeeState } from "../employee-state";
import { given } from "@nivinjoseph/n-defensive";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";


export class EmployeeEmailUpdated extends DomainEvent<EmployeeState>
{
    private readonly _email: string;
    

    public constructor(data: DomainEventData, email: string)
    {
        super(data);
        
        given(email, "email").ensureIsString();
        this._email = email;
    }

    public static deserializeEvent(data: DomainEventData & Serialized): EmployeeEmailUpdated
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new EmployeeEmailUpdated(data, data.email);
    }


    protected serializeEvent(): Serialized
    {
        return {
            email: this._email
        };
    }

    protected applyEvent(state: EmployeeState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.email = this._email;
    }    
}


interface Serialized
{
    email: string;
}