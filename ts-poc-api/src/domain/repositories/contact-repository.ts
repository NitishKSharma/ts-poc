import { Contact } from "../aggregates/contact/employee";


export interface ContactRepository
{
    getAll(): Promise<ReadonlyArray<Contact>>;
    get(id: string): Promise<Contact>;
    save(contact: Contact): Promise<void>;
    delete(id: string): Promise<void>;
}