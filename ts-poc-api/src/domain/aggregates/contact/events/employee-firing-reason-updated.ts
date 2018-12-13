import { EmployeeState } from "../employee-state";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";
import { given } from "@nivinjoseph/n-defensive";


export class EmployeeFiringReasonUpdated extends DomainEvent<EmployeeState>
{
    private readonly _firingReason: string;


    public constructor(data: DomainEventData, firingReason: string)
    {
        super(data);

        given(firingReason, "firingReason").ensureIsString();
        this._firingReason = firingReason;
    }

    public static deserializeEvent(data: DomainEventData & Serialized)
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new EmployeeFiringReasonUpdated(data, data.firingReason);
    }


    protected serializeEvent(): Serialized
    {
        return {
            firingReason: this._firingReason
        };
    }

    protected applyEvent(state: EmployeeState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();
    }
}


interface Serialized
{
    firingReason: string;
}