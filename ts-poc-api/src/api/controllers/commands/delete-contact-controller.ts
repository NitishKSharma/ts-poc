import { Controller, command, route } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { ContactRepository } from "../../../domain/repositories/contact-repository";
import { given } from "@nivinjoseph/n-defensive";
import { Validator } from "@nivinjoseph/n-validate";
import { ValidationException } from "../../exceptions/validation-exception";


@route(Routes.command.deleteContact)
@command
@inject("ContactRepository")
export class DeleteContactController extends Controller
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

        await this._contactRepository.delete(model.id);
    }


    private validateModel(model: Model): void
    {
        let validator = new Validator<Model>();

        validator.for<string>("id")
            .isRequired()
            .ensureIsString();
        
        validator.validate(model);

        if (validator.hasErrors)
            throw new ValidationException(validator.errors);
    }
}


interface Model
{
    id: string;
}