import { given } from "@nivinjoseph/n-defensive";
import "@nivinjoseph/n-ext";
import { ContactState } from "./contact-state";
import { AggregateRoot, DomainContext, AggregateRootData, DomainEvent} from "@nivinjoseph/n-domain";
import { ContactCreated } from "./events/contact-created";
import { ContactEmailUpdated } from "./events/contact-email-updated";
import { ContactPhoneUpdated } from "./events/contact-phone-updated";
import { ContactSetEmployee } from "./events/contact-set-employee";
import { ContactUnSetEmployee } from "./events/contact-unset-employee";

export class Contact extends AggregateRoot<ContactState>
{
    public get createdAt(): number { return this.events.find(t => t.name === (<Object>ContactCreated).getTypeName()).occurredAt; }
    public get fullName(): string { return this.state.fullName; }
    public get phone(): number { return this.state.phone; }
    public get email(): string { return this.state.email; }
    public get isEmployee(): boolean { return this.state.isEmployee; }


    public constructor(domainContext: DomainContext, events: ReadonlyArray<DomainEvent<ContactState>>)
    {
        super(domainContext, events, { isEmployee: false });
    }


    public static deserialize(domainContext: DomainContext, data: object): Contact
    {
        const eventTypes = [
            ContactCreated,
            ContactEmailUpdated,
            ContactPhoneUpdated,
            ContactSetEmployee,
            ContactUnSetEmployee
        ];

        return AggregateRoot.deserialize(domainContext, Contact, eventTypes, data as AggregateRootData) as Contact;
    }


    public updateEmail(email: string | null): void
    {
        given(email, "email").ensureIsString();
        
        email = email ? email.trim() : null;

        this.applyEvent(new ContactEmailUpdated({}, email));
    }

    public updatePhone(phone: number): void
    {
        given(phone, "phone").ensureIsNumber();

        this.applyEvent(new ContactPhoneUpdated({}, phone));
    }

    public setEmployee(): void
    {
        given(this, "this").ensure(t => !t.state.isEmployee, "already an employee");
        
        this.applyEvent(new ContactSetEmployee({}));
    }

    public unSetEmployee(): void
    {
        this.applyEvent(new ContactUnSetEmployee({}));
    }

}