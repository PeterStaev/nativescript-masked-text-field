import { Observable } from "data/observable";
import { EventData } from "data/observable";
import { Page } from "ui/page";

let viewModel: Observable;
export function navigatingTo(args: EventData) {
    const page = args.object as Page;
    
    viewModel = new Observable();
    setTimeout(() => { viewModel.set("value", "(234)x5690"); }, 3000);
    // setTimeout(() => { viewModel.set("value", "(234)x56901"); }, 5000);
    page.bindingContext = viewModel;
}