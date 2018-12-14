import { given } from "@nivinjoseph/n-defensive";


export class Address
{
    private readonly _streetNumber: string;
    private readonly _streetName: string;
    private readonly _city: string;
    private readonly _state: string;
    private readonly _zipCode: string;


    public get streetNumber(): string { return this._streetNumber; }
    public get streetName(): string { return this._streetName; }
    public get city(): string { return this._city; }
    public get state(): string { return this._state; }
    public get zipCode(): string { return this._zipCode; }

    
    public constructor(streetNumber: string, streetName: string, city: string, state: string, zipCode: string)
    {
        given(streetNumber, "streetNumber").ensureHasValue().ensureIsString();
        this._streetNumber = streetNumber;

        given(streetName, "streetName").ensureHasValue().ensureIsString();
        this._streetName = streetName;

        given(city, "city").ensureHasValue().ensureIsString();
        this._city = city;

        given(state, "state").ensureHasValue().ensureIsString();
        this._state = state;

        given(zipCode, "zipCode").ensureHasValue().ensureIsString();
        this._zipCode = zipCode;
    }

    public static deserialize(data: Serialized): Address
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new Address(data.streetNumber, data.streetName, data.city, data.state, data.zipCode);
    }

    public serialize(): Serialized
    {
        return {
            streetNumber: this._streetNumber,
            streetName: this._streetName,
            city: this._city,
            state: this._state,
            zipCode: this._zipCode
        };
    }
}


export interface Serialized
{
    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    zipCode: string;
}