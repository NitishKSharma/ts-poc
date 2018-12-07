import { Contact } from "../aggregates/contact/contact";


export interface ContactFactory
{
    create(fullName: string, phone: number, email: string): Promise<Contact>;
}