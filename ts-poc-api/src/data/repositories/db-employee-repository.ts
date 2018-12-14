import { EmployeeRepository } from "../../domain/repositories/employee-repository";
import { Db } from "@nivinjoseph/n-data";
import { given } from "@nivinjoseph/n-defensive";
import { inject } from "@nivinjoseph/n-ject";
import { Employee } from "../../domain/aggregates/employee/employee";
import { DomainContext } from "@nivinjoseph/n-domain";
import { EmployeeNotFoundException } from "../../domain/exceptions/employee-not-found-exception";

@inject("Db", "DomainContext")
export class DbEmployeeRepository implements EmployeeRepository
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


    public async getAll(): Promise<ReadonlyArray<Employee>>
    {
        const sql = `select data from employees order by created_at;`;
        const queryResult = await this._db.executeQuery<any>(sql);
        return queryResult.rows.map(t => Employee.deserialize(this._domainContext, t.data));
    }


    public async get(id: string): Promise<Employee>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        const sql = `select data from employees where id = ?;`;
        const result = await this._db.executeQuery<any>(sql, id);
        if (result.rows.length === 0)
            throw new EmployeeNotFoundException(id);

        return Employee.deserialize(this._domainContext, result.rows[0].data);
    }


    public async save(employee: Employee): Promise<void>
    {
        given(employee, "Employee").ensureHasValue().ensureIsType(Employee);

        const exists = await this.checkIfEmployeeExists(employee.id);
        if (exists && employee.hasChanges)
        {            
            const sql = `update employees 
                        set version = ?, updated_at = ?, data = ?
                        where id = ? and version = ?;`;

            const params = [employee.currentVersion, employee.updatedAt, employee.serialize(), employee.id, employee.retroVersion];

            await this._db.executeCommand(sql, ...params);
        }
        else
        {
            const sql = `insert into employees (id, version, created_at, updated_at, data) values(?, ?, ?, ?, ?)`;

            const params = [employee.id, employee.version, employee.createdAt, employee.updatedAt, employee.serialize()];

            await this._db.executeCommand(sql, ...params);
        }
    }

    public async delete(id: string): Promise<void>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        id = id.trim();
        const exists = await this.checkIfEmployeeExists(id);
        if (!exists)
            return;
        
        const sql = `delete from employees where id = ?;`;

        await this._db.executeCommand(sql, id);
    }


    private async checkIfEmployeeExists(id: string): Promise<boolean>
    {
        const sql = `select exists (select 1 from employees where id = ?);`;

        const result = await this._db.executeQuery<any>(sql, id);
        return result.rows[0].exists;
    }
}