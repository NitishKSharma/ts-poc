import { Controller, command, route } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { EmployeeRepository } from "../../../domain/repositories/employee-repository";
import { given } from "@nivinjoseph/n-defensive";
import { Validator } from "@nivinjoseph/n-validate";
import { ValidationException } from "../../exceptions/validation-exception";


@route(Routes.command.fire)
@command
@inject("EmployeeRepository")
export class FireController extends Controller
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
        
        const employee = await this._employeeRepository.get(model.id);
        employee.fire();
        employee.updateEmployeeFiringReason(model.firingReason);
        await this._employeeRepository.save(employee);
    }

    private validateModel(model: Model): void
    {
        let validator = new Validator<Model>();

        validator.for<string>("id")
            .isRequired()
            .ensureIsString();
        
        validator.for<string>("firingReason")
            .isRequired().
            ensureIsString();
        
        validator.validate(model);

        if (validator.hasErrors)
            throw new ValidationException(validator.errors);

    }
}

interface Model
{
    id: string;
    firingReason: string;
}