import { EmployeeState } from "../employee-state";
import { given } from "@nivinjoseph/n-defensive";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";

export class EmployeePhoneUpdated extends DomainEvent<EmployeeState>
{
    private readonly _phone: string;


    public constructor(data: DomainEventData, phone: string)
    {
        super(data);

        given(phone, "phone").ensureIsString();
        this._phone = phone;
    }

    public static deserializeEvent(data: DomainEventData & Serialized): EmployeePhoneUpdated
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new EmployeePhoneUpdated(data, data.phone);
    }


    protected serializeEvent(): object
    {
        return {
            phone: this._phone
        };
    }

    protected applyEvent(state: EmployeeState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();

        state.phone = this._phone;
    }
}


interface Serialized
{
    phone: string;
}