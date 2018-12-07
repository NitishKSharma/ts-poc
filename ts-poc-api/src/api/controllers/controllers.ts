import { GetAllTodosController } from "./queries/get-all-todos-controller";
import { GetTodoController } from "./queries/get-todo-controller";
import { CreateTodoController } from "./commands/create-todo-controller";
import { UpdateTodoController } from "./commands/update-todo-command";
import { MarkTodoAsCompletedController } from "./commands/mark-todo-as-completed";
import { DeleteTodoController } from "./commands/delete-todo-controller";
import { GetAllContactsController } from "./queries/get-all-contacts-controller";
import { GetContactController } from "./queries/get-contact-controller";
import { CreateContactController } from "./commands/create-contact-controller";
import { DeleteContactController } from "./commands/delete-contact-controller";
import { SetContactEmployeeController } from "./commands/set-contact-employee-controller";
import { UnSetContactEmployeeController } from "./commands/unset-contact-employee-controller";
import { UpdateContactController } from "./commands/update-contact-command-controller";


export const controllers: Array<Function> = [
    GetAllTodosController,
    GetTodoController,
    CreateTodoController,
    UpdateTodoController,
    MarkTodoAsCompletedController,
    DeleteTodoController,
    GetAllContactsController,
    GetContactController,
    CreateContactController,
    DeleteContactController,
    SetContactEmployeeController,
    UnSetContactEmployeeController,
    UpdateContactController
];