import { Controller, command, route } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { EmployeeRepository } from "../../../domain/repositories/employee-repository";
import { given } from "@nivinjoseph/n-defensive";
import { Validator} from "@nivinjoseph/n-validate";
import { ValidationException } from "../../exceptions/validation-exception";

@route(Routes.command.updateEmployee)
@command
@inject("EmployeeRepository")
export class UpdateEmployeeController extends Controller
{
    private readonly _employeeRepository: EmployeeRepository;


    public constructor(employeeRepository: EmployeeRepository)
    {
        super();
        
        given(employeeRepository, "employeeRepository").ensureHasValue().ensureIsObject();
        this._employeeRepository = employeeRepository;
    }


    public async execute(model: Model): Promise<void>
    {
        given(model, "model").ensureHasValue().ensureIsObject();

        this.validateModel(model);

        const contact = await this._employeeRepository.get(model.id);
        contact.updateEmail(model.email);
        contact.updatePhone(model.phone);
        contact.updateSsn(model.ssn);
        contact.updateEmployeeId(model.employeeId);
        contact.updateEmployeeFiringReason(model.firingReason);

        console.log("retro events", contact.retroEvents.length);
        console.log("current events", contact.currentEvents.length);
        await this._employeeRepository.save(contact);
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
        
        validator.for<number>("ssn")
            .isOptional()
            .ensureIsNumber();
        
        validator.for<string>("employeeId")
            .isOptional()
            .ensureIsString();
        
        validator.for<string>("firingReason")
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
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
    ssn?: number;
    employeeId?: string;
    firingReason?: string;
}