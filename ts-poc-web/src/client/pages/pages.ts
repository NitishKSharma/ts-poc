import { ListTodosViewModel } from "./list-todos/list-todos-view-model";
import { ManageTodoViewModel } from "./manage-todo/manage-todo-view-model";
import { ListContactsViewModel } from "./list-contacts/list-contacts-view-model";
import { ManageContactViewModel } from "./manage-contact/manage-contact-view-model";
import { WelcomeViewModel } from "./welcome/welcome-view-model";


export const pages: Array<Function> = [
    ListTodosViewModel,
    ManageTodoViewModel,
    ListContactsViewModel,
    ManageContactViewModel,
    WelcomeViewModel
];