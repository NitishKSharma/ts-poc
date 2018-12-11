import { template, route, PageViewModel } from "@nivinjoseph/n-app";
import * as Routes from "../routes";
import "./welcome-view.scss";

@template(require("./welcome-view.html"))
@route(Routes.welcomePage)
export class WelcomeViewModel extends PageViewModel
{
    public constructor()
    {
        super();
    }


    protected onEnter(): void
    {
        
    }
}