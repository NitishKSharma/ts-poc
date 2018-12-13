import { Contact } from "../aggregates/contact/employee";


export interface ContactFactory
{
    create(fullName: string): Promise<Contact>;
}