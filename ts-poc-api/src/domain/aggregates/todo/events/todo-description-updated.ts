import { TodoState } from "../todo-state";
import { given } from "@nivinjoseph/n-defensive";
import { DomainEvent, DomainEventData } from "@nivinjoseph/n-domain";


export class TodoDescriptionUpdated extends DomainEvent<TodoState>
{
    private readonly _description: string;


    public constructor(data: DomainEventData, description: string)
    {
        super(data);
        
        given(description, "description").ensureIsString();
        this._description = description;
    }

    
    public static deserializeEvent(data: DomainEventData & Serialized): TodoDescriptionUpdated
    {
        given(data, "data").ensureHasValue().ensureIsObject();

        return new TodoDescriptionUpdated(data, data.description);
    }


    protected serializeEvent(): Serialized
    {
        return {
            description: this._description
        };
    }

    protected applyEvent(state: TodoState): void
    {
        given(state, "state").ensureHasValue().ensureIsObject();
        
        state.description = this._description;
    }
}


interface Serialized
{
    description: string;
}