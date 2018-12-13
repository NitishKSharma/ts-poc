import { EmployeeState } from "../employee-state";
import { given } from "@nivinjoseph/n-defensive";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";
import { EmployeeEmploymentStatus } from "../value-objects/employee-employment-status";

export class EmployeeHired extends DomainEvent<EmployeeState>
{
    public static deserializeEvent(data: DomainEventData): EmployeeHired
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new EmployeeHired(data);
    }

    
    protected serializeEvent(): object
    {
        return {};
    }
        
    protected applyEvent(state: EmployeeState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.employmentStatus = EmployeeEmploymentStatus.employee;
    }    
}
