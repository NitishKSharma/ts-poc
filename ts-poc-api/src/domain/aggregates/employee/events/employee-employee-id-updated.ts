import { EmployeeState } from "../employee-state";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";
import { given } from "@nivinjoseph/n-defensive";


export class EmployeeEmployeeIdUpdated extends DomainEvent<EmployeeState>
{   
    private readonly _employeeId: string;


    public constructor(data: DomainEventData, employeeId: string)
    {
        super(data);

        given(employeeId, "employeeId").ensureIsString();
        this._employeeId = employeeId;
    }

    public static deserializeEvent(data: DomainEventData & Serialized): EmployeeEmployeeIdUpdated
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new EmployeeEmployeeIdUpdated(data, data.employeeId);
    }


    protected serializeEvent(): object
    {
        return {
            employeeId: this._employeeId
        };
    }

    protected applyEvent(state: EmployeeState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.employeeId = this._employeeId;
    }
}


interface Serialized
{
    employeeId: string;
}