import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { EmployeeState } from "./employee-state";
import { AggregateRoot, DomainContext, AggregateRootData, DomainEvent } from "@nivinjoseph/n-domain";
import { EmployeeCreated } from "./events/employee-created";
import { EmployeeEmailUpdated } from "./events/employee-email-updated";
import { EmployeePhoneUpdated } from "./events/employee-phone-updated";
import { EmployeeHired } from "./events/employee-hired";
import { EmployeeFired } from "./events/employee-fired";
import { EmployeeEmploymentStatus } from "./value-objects/employee-employment-status";
import { EmployeeSsnUpdated } from "./events/employee-ssn-updated";
import { EmployeeEmployeeIdUpdated } from "./events/employee-employee-id-updated";
import { EmployeeEmploymentStatusUpdated } from "./events/employee-employment-status-updated";
import { EmployeeFiringReasonUpdated } from "./events/employee-firing-reason-updated";

export class Employee extends AggregateRoot<EmployeeState>
{
    public get createdAt(): number { return this.events.find(t => t.name === (<Object>EmployeeCreated).getTypeName()).occurredAt; }
    public get firstName(): string { return this.state.firstName; }
    public get lastName(): string { return this.state.lastName; }
    public get phone(): string { return this.state.phone; }
    public get email(): string { return this.state.email; }
    public get ssn(): number { return this.state.ssn; }
    public get employeeId(): string { return this.state.employeeId; }
    public get employmentStatus(): EmployeeEmploymentStatus { return this.state.employmentStatus; }
    public get firingReason(): string { return this.state.firingReason; }


    public constructor(domainContext: DomainContext, events: ReadonlyArray<DomainEvent<EmployeeState>>)
    {
        super(domainContext, events, { isEmployee: false });
    }


    public static deserialize(domainContext: DomainContext, data: object): Employee
    {
        const eventTypes = [
            EmployeeCreated,
            EmployeeEmailUpdated,
            EmployeePhoneUpdated,
        ];

        return AggregateRoot.deserialize(domainContext, Employee, eventTypes, data as AggregateRootData) as Employee;
    }


    public updateEmail(email: string | null): void
    {
        if (email)
            given(email, "email").ensureIsString();

        email = email ? email.trim() : null;

        if (this.state.email === email)
            return;

        this.applyEvent(new EmployeeEmailUpdated({}, email));
    }

    public updatePhone(phone: string | null): void
    {
        if (phone)
            given(phone, "phone").ensureIsString();

        phone = phone ? phone.trim() : null;

        if (this.state.phone === phone)
            return;

        this.applyEvent(new EmployeePhoneUpdated({}, phone));
    }

    public updateSsn(ssn: number | null): void
    {
        if (ssn != null)        
            given(ssn, "ssn").ensureIsNumber();
        
        if (this.state.ssn === ssn)
            return;
        
        this.applyEvent(new EmployeeSsnUpdated({}, ssn));
    }

    public updateEmployeeId(employeeId: string | null): void
    {
        if (employeeId)
            given(employeeId, "employeeId").ensureIsString();
        
        employeeId = employeeId ? employeeId.trim() : null;

        if (this.state.employeeId === employeeId)
            return;
        
        this.applyEvent(new EmployeeEmployeeIdUpdated({}, employeeId));
    }

    public updateEmploymentStatus(employmentStatus: EmployeeEmploymentStatus | null): void
    {
        // if (employmentStatus)
        //     given(employmentStatus, "employmentStatus")

        if (this.state.employmentStatus === employmentStatus)
            return;
        
        this.applyEvent(new EmployeeEmploymentStatusUpdated({}, employmentStatus));
    }

    public updateEmployeeFiringReason(firingReason: string | null): void
    {
        if (firingReason)
            given(firingReason, "firingReason").ensureIsString();
        
        firingReason = firingReason ? firingReason.trim() : null;

        if (this.state.firingReason === firingReason)
            return;
        
        this.applyEvent(new EmployeeFiringReasonUpdated({}, firingReason));
    }

    public hire(): void
    {
        given(this, "this").ensure(t => t.state.employmentStatus === EmployeeEmploymentStatus.employee, "Can not hire someone who is already an employee");
        this.applyEvent(new EmployeeHired({}));
    }

    public fire(): void
    {
        given(this, "this").ensure(t => t.state.employmentStatus === EmployeeEmploymentStatus.notAnEmployee, "Can not fire someone who doesn't work here. Are you crazy or what?");
        this.applyEvent(new EmployeeFired({}));
    }

}