import { Component } from "@angular/core";
import * as dialogs from "ui/dialogs";

@Component({
    selector: "mtf",
    moduleId: module.id,
    templateUrl: "./maskedtextfield.component.html",
})
export class MaskedTextFieldComponent {
    public value: string = "";

    public getModelValue() {
        dialogs.alert(this.value);
    }
}
