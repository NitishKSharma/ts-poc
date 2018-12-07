import { Controller, command, route } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { ContactRepository } from "../../../domain/repositories/contact-repository";
import { given } from "@nivinjoseph/n-defensive";
import { Validator, strval } from "@nivinjoseph/n-validate";
import { ValidationException } from "../../exceptions/validation-exception";

@route(Routes.command.updateContact)
@command
@inject("ContactRepository")
export class UpdateContactController extends Controller
{
    private readonly _contactRepository: ContactRepository;


    public constructor(contactRepository: ContactRepository)
    {
        super();
        
        given(contactRepository, "contactRepository").ensureHasValue().ensureIsObject();
        this._contactRepository = contactRepository;
    }


    public async execute(model: Model): Promise<void>
    {
        given(model, "model").ensureHasValue().ensureIsObject();

        this.validateModel(model);

        const contact = await this._contactRepository.get(model.id);
        contact.updateEmail(model.email);
        contact.updatePhone(model.phone);

        console.log("retro events", contact.retroEvents.length);
        console.log("current events", contact.currentEvents.length);
    }


    private validateModel(model: Model): void
    {
        let validator = new Validator<Model>();

        validator.for<string>("id")
            .isRequired()
            .ensureIsString();
        
        validator.for<number>("phone")
            .isOptional()
            .ensureIsNumber();
        
        validator.for<string>("email")
            .isOptional()
            .ensureIsString();
        
        validator.validate(model);

        if (validator.hasErrors)
            throw new ValidationException(validator.errors);
    }
}

interface Model
{
    id: string;
    fullName: string;
    phone?: number;
    email?: string;
}