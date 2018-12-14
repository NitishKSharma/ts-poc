import { EmployeeState } from "../employee-state";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";
import { given } from "@nivinjoseph/n-defensive";

export class EmployeeSsnUpdated extends DomainEvent<EmployeeState>
{
    private readonly _ssn: number;


    public constructor(data: DomainEventData, ssn: number)
    {
        super(data);

        given(ssn, "ssn").ensureIsNumber();
        this._ssn = ssn;
    }

    public static deserializeEvent(data: DomainEventData & Serialized)
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new EmployeeSsnUpdated(data, data.ssn);
    }


    protected serializeEvent(): Serialized
    {
        return {
            ssn: this._ssn
        };
    }

    protected applyEvent(state: EmployeeState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.ssn = this._ssn;
    }
}


interface Serialized
{
    ssn: number;
}