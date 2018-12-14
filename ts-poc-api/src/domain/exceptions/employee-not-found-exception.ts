import { ApplicationException } from "@nivinjoseph/n-exception";
import { given } from "@nivinjoseph/n-defensive";

export class EmployeeNotFoundException extends ApplicationException
{
    public constructor(id: string)
    {
        given(id, "id").ensureHasValue().ensureIsString();

        super(`Employee with id '${id}' was not found.`);
    }
}