import { Controller, route, query } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { ContactRepository } from "../../../domain/repositories/contact-repository";
import { given } from "@nivinjoseph/n-defensive";

@route(Routes.query.getAllContacts)
@query
@inject("ContactRepository")
export class GetAllContactsController extends Controller
{
    private readonly _contactRepository: ContactRepository;


    public constructor(contactRepository: ContactRepository)
    {
        super();
        given(contactRepository, "contactRepository").ensureHasValue().ensureIsObject();
        this._contactRepository = contactRepository;
    }


    public async execute(): Promise<ReadonlyArray<object>>
    {
        const contacts = await this._contactRepository.getAll();
        return contacts.map(t => (
            {
                id: t.id,
                fullName: t.fullName,
                phone: t.phone,
                email: t.email,
                isEmployee: t.isEmployee
            }
        ));
    }
}