const queryPrefix = "/api/query/";

export const query = {
    getAllTodos: queryPrefix + "getAllTodos",
    getTodo: queryPrefix + "getTodo/{id: string}",
    getAllEmployees: queryPrefix + "getAllEmployees",
    getEmployee: queryPrefix + "getEmployee/{id: string}"
};


const commandPrefix = "/api/command/";

export const command = {
    createTodo: commandPrefix + "createTodo",
    updateTodo: commandPrefix + "updateTodo",
    markTodoAsCompleted: commandPrefix + "markTodoAsCompleted",
    deleteTodo: commandPrefix + "deleteTodo",
    createEmployee: commandPrefix + "createEmployee",
    updateEmployee: commandPrefix + "updateEmployee",    
    hire: commandPrefix + "hire",
    fire: commandPrefix + "fire",    
};