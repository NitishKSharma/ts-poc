import { Contact } from "../../models/contact";

export interface ContactService
{
    getContacts(): Promise<ReadonlyArray<Contact>>;
    getContact(id: string): Promise<Contact>;
    createContact(fullName: string, phone: number, email: string): Promise<Contact>;
    updateContact(id: string, fullName: string, phone: number, email: string): Promise<void>;
    setAsEmployee(id: string): Promise<void>;
    unSetAsEmployee(id: string): Promise<void>;
    deleteContact(id: string): Promise<void>;
}