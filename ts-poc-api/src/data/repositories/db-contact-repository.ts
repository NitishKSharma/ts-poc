import { ContactRepository } from "../../domain/repositories/contact-repository";
import { Db } from "@nivinjoseph/n-data";
import { given } from "@nivinjoseph/n-defensive";
import { inject } from "@nivinjoseph/n-ject";
import { Contact } from "../../domain/aggregates/contact/contact";
import { DomainContext } from "@nivinjoseph/n-domain";
import { ContactNotFoundException } from "../../domain/exceptions/contact-not-found-exception";

@inject("Db", "DomainContext")
export class DbContactRepository implements ContactRepository
{
    private readonly _db: Db;
    private readonly _domainContext: DomainContext;


    public constructor(db: Db, domainContext: DomainContext)
    {
        given(db, "db").ensureHasValue().ensureIsObject();
        this._db = db;

        given(domainContext, "domainContext").ensureHasValue().ensureIsObject();
        this._domainContext = domainContext;
    }


    public async getAll(): Promise<ReadonlyArray<Contact>>
    {
        const sql = `select data from contacts order by created_at;`;
        const queryResult = await this._db.executeQuery<any>(sql);
        return queryResult.rows.map(t => Contact.deserialize(this._domainContext, t.data));
    }


    public async get(id: string): Promise<Contact>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        const sql = `select data from contacts where id = ?;`;
        const result = await this._db.executeQuery<any>(sql, id);
        if (result.rows.length === 0)
            throw new ContactNotFoundException(id);


        return Contact.deserialize(this._domainContext, result.rows[0].data);
    }

    public async save(contact: Contact): Promise<void>
    {
        given(contact, "contact").ensureHasValue().ensureIsType(Contact);

        const exists = await this.checkIfContactExists(contact.id);
        if (exists && contact.hasChanges)
        {
            const sql = `update contacts 
                        set version = ?, updated_at = ?, data = ?
                        where id = ? and version = ?;`;

            const params = [contact.currentVersion, contact.updatedAt, contact.serialize(), contact.id, contact.retroVersion];

            await this._db.executeCommand(sql, ...params);
        }
        else
        {
            const sql = `insert into contacts (id, version, created_at, updated_at, data) values(?, ?, ?, ?, ?)`;

            const params = [contact.id, contact.version, contact.createdAt, contact.updatedAt, contact.serialize()];

            await this._db.executeCommand(sql, ...params);
        }
    }

    public async delete(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        const exists = await this.checkIfContactExists(id);
        if (!exists)
            return;
        
        const sql = `delete from contacts where id = ?;`;

        await this._db.executeCommand(sql, id);
    }


    private async checkIfContactExists(id: string): Promise<boolean>
    {
        const sql = `select exists (select 1 from contacts where id = ?);`;

        const result = await this._db.executeQuery<any>(sql, id);
        return result.rows[0].exists;
    }
}