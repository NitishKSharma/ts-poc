import { Controller, command, route } from "@nivinjoseph/n-web";
import * as Routes from "../routes";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { EmployeeFactory } from "../../../domain/factories/employee-factory";
import { Validator, strval } from "@nivinjoseph/n-validate";
import { ValidationException } from "../../exceptions/validation-exception";
import { EmployeeRepository } from "../../../domain/repositories/employee-repository";
import { EmployeeEmploymentStatus } from "../../../domain/aggregates/employee/value-objects/employee-employment-status";


@route(Routes.command.createEmployee)
@command
@inject("EmployeeFactory", "EmployeeRepository")
export class CreateEmployeeController extends Controller
{
    private readonly _employeeFactory: EmployeeFactory;
    private readonly _employeeRepository: EmployeeRepository;


    public constructor(employeeFactory: EmployeeFactory, employeeRepository: EmployeeRepository)
    {
        super();

        given(employeeFactory, "employeeFactory").ensureHasValue().ensureIsObject();
        this._employeeRepository = employeeRepository;

        given(employeeRepository, "employeeRepository").ensureHasValue().ensureIsObject();
        this._employeeFactory = employeeFactory;        
    }

    public async execute(model: Model): Promise<object>
    {
        given(model, "model").ensureHasValue().ensureIsObject();

        this.validateModel(model);

        const employee = await this._employeeFactory.create(model.firstName, model.lastName);
        
        if (model.email)
            employee.updateEmail(model.email);
        
        if (model.phone)
            employee.updatePhone(model.phone);
        
        if (model.ssn)
            employee.updateSsn(model.ssn);
        
        if (model.employeeId)
            employee.updateEmployeeId(model.employeeId);
        
        if (model.employmentStatus)
            employee.updateEmploymentStatus(model.employmentStatus);
        
        // if (model.firingReason)
        //     employee.updateEmployeeFiringReason(model.firingReason);
           
        await this._employeeRepository.save(employee);
        
        return {
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,            
            phone: employee.phone,
            email: employee.email,
            ssn: employee.ssn,
            employeeId: employee.employeeId,
            employmentStatus: employee.employmentStatus,
            firingReason: employee.firingReason
        };
    }

    private validateModel(model: Model): void
    {
        let validator = new Validator<Model>();

        validator.for<string>("fullName")
            .isRequired()
            .ensureIsString()
            .useValidationRule(strval.hasMaxLength(128));
        
        validator.for<string>("phone")
            .isOptional()
            .ensureIsString()
            .useValidationRule(strval.isPhoneNumber());
        
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
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
    ssn?: number;
    employeeId?: string;
    employmentStatus?: EmployeeEmploymentStatus;
}