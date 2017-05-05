import { Observable } from "data/observable";
import { EventData } from "data/observable";
import { Page } from "ui/page";

let viewModel: Observable;
export function navigatingTo(args: EventData) {
    const page = args.object as Page;
    
    viewModel = new Observable();
    viewModel.set("value", "");
    page.bindingContext = viewModel;
}