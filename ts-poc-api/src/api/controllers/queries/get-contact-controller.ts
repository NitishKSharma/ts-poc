import { Controller, route, query } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { ContactRepository } from "../../../domain/repositories/contact-repository";
import { given } from "@nivinjoseph/n-defensive";

@route(Routes.query.getContact)
@query
@inject("ContactRepository")
export class GetContactController extends Controller 
{
    private readonly _contactRepository: ContactRepository;

    public constructor(contactRepository: ContactRepository)
    {
        super();
        given(contactRepository, "contactRepository").ensureHasValue().ensureIsObject();
        this._contactRepository = contactRepository;
    }


    public async execute(id: string): Promise<object>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        const contact = await this._contactRepository.get(id);

        return {
            id: contact.id,
            fullName: contact.fullName,
            phone: contact.phone,
            email: contact.email,
            isEmployee: contact.isEmployee
        };
    }
}