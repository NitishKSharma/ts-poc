import { EmployeeState } from "../employee-state";
import { EmployeeEmploymentStatus } from "../value-objects/employee-employment-status";
import { DomainEventData, DomainEvent } from "@nivinjoseph/n-domain";
import { given } from "@nivinjoseph/n-defensive";

export class EmployeeEmploymentStatusUpdated extends DomainEvent<EmployeeState>
{
    private readonly _employmentStatus: EmployeeEmploymentStatus;


    public constructor(data: DomainEventData, employmentStatus: EmployeeEmploymentStatus)
    {
        super(data);

        // given(employmentStatus, "employmentStatus").ensureIsType(EmployeeEmploymentStatus);
        this._employmentStatus = employmentStatus;
    }

    public static deserializeEvent(data: DomainEventData & Serialized): EmployeeEmploymentStatusUpdated
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new EmployeeEmploymentStatusUpdated(data, data.employmentStatus);
    }


    protected serializeEvent(): object
    {
        return {
            employmentStatus: this._employmentStatus
        };
    }

    protected applyEvent(state: EmployeeState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.employmentStatus = this._employmentStatus;
    }
}


interface Serialized
{
    employmentStatus: EmployeeEmploymentStatus;
}