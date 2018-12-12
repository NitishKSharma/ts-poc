import { Contact } from "../aggregates/contact/contact";


export interface ContactFactory
{
    create(fullName: string): Promise<Contact>;
}