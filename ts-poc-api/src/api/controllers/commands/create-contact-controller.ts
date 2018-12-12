import { Controller, command, route } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { ContactFactory } from "../../../domain/factories/contact-factory";
import { Validator, strval } from "@nivinjoseph/n-validate";
import { ValidationException } from "../../exceptions/validation-exception";
import { ContactRepository } from "../../../domain/repositories/contact-repository";

@route(Routes.command.createContact)
@command
@inject("ContactFactory", "ContactRepository")
export class CreateContactController extends Controller
{
    private readonly _contactFactory: ContactFactory;
    private readonly _contactRepository: ContactRepository;


    public constructor(contactFactory: ContactFactory, contactRepository: ContactRepository)
    {
        super();

        given(contactFactory, "contactFactory").ensureHasValue().ensureIsObject();
        given(contactRepository, "contactRepository").ensureHasValue().ensureIsObject();
        this._contactFactory = contactFactory;
        this._contactRepository = contactRepository;
    }

    public async execute(model: Model): Promise<object>
    {
        given(model, "model").ensureHasValue().ensureIsObject();

        this.validateModel(model);

        const contact = await this._contactFactory.create(model.fullName);
        
        if (contact.email)
            contact.updateEmail(contact.email);
        
        if (contact.phone)
            contact.updatePhone(contact.phone);
                
        await this._contactRepository.save(contact);
        
        return {
            id: contact.id,
            fullName: contact.fullName,
            phone: contact.phone,
            email: contact.email
        };
    }

    private validateModel(model: Model): void
    {
        let validator = new Validator<Model>();

        validator.for<string>("fullName")
            .isRequired()
            .ensureIsString()
            .useValidationRule(strval.hasMaxLength(128));
        
        validator.for<number>("phone")
            .isOptional()
            .ensureIsNumber();
        
        validator.for<string>("email")
            .isOptional()
            .ensureIsString()
            .useValidationRule(strval.isEmail());
        
        validator.validate(model);

        if (validator.hasErrors)
            throw new ValidationException(validator.errors);
    }
}

interface Model
{
    fullName: string;
    phone?: number;
    email?: string;
}