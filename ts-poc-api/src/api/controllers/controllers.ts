import { GetAllTodosController } from "./queries/get-all-todos-controller";
import { GetTodoController } from "./queries/get-todo-controller";
import { CreateTodoController } from "./commands/create-todo-controller";
import { UpdateTodoController } from "./commands/update-todo-command";
import { MarkTodoAsCompletedController } from "./commands/mark-todo-as-completed";
import { DeleteTodoController } from "./commands/delete-todo-controller";
import { GetAllEmployeesController } from "./queries/get-all-contacts-controller";
import { GetEmployeeController } from "./queries/get-employee-controller";
import { CreateEmployeeController } from "./commands/create-employee-controller";
import { HireController } from "./commands/hire-controller";
import { FireController } from "./commands/fire-controller";
import { UpdateEmployeeController } from "./commands/update-employee-command-controller";


export const controllers: Array<Function> = [
    GetAllTodosController,
    GetTodoController,
    CreateTodoController,
    UpdateTodoController,
    MarkTodoAsCompletedController,
    DeleteTodoController,
    GetAllEmployeesController,
    GetEmployeeController,
    CreateEmployeeController,
    HireController,
    FireController,
    UpdateEmployeeController
];