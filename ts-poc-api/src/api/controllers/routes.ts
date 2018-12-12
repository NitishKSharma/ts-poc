const queryPrefix = "/api/query/";

export const query = {
    getAllTodos: queryPrefix + "getAllTodos",
    getTodo: queryPrefix + "getTodo/{id: string}",
    getAllContacts: queryPrefix + "getAllContacts",
    getContact: queryPrefix + "getContact/{id: string}"
};


const commandPrefix = "/api/command/";

export const command = {
    createTodo: commandPrefix + "createTodo",
    updateTodo: commandPrefix + "updateTodo",
    markTodoAsCompleted: commandPrefix + "markTodoAsCompleted",
    deleteTodo: commandPrefix + "deleteTodo",
    createContact: commandPrefix + "createContact",
    updateContact: commandPrefix + "updateContact",
    setContactEmployee: commandPrefix + "setContactEmployee",
    unSetContactEmployee: commandPrefix + "unSetContactEmployee",
    deleteContact: commandPrefix + "deleteContact",
};