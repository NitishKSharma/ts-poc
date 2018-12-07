import { AggregateState } from "@nivinjoseph/n-domain";

export interface ContactState extends AggregateState
{
    fullName: string;
    phone: number;
    email: string;
    isEmployee: boolean;
}