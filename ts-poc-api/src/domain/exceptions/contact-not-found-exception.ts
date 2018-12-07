import { ApplicationException } from "@nivinjoseph/n-exception";
import { given } from "@nivinjoseph/n-defensive";

export class ContactNotFoundException extends ApplicationException
{
    public constructor(id: string)
    {
        given(id, "id").ensureHasValue().ensureIsString();

        super(`Contact with id '${id}' was not found.`);
    }
}