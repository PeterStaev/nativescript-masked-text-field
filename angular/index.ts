import { Directive, NgModule, forwardRef } from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TextValueAccessor, registerElement } from "nativescript-angular";

registerElement("MaskedTextField", () => require("../masked-text-field").MaskedTextField);

const MASKED_TEXT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MaskedTextValueAccessor), multi: true
};

/**
 * The accessor for setting a selectedIndex and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <MaskedTextField [(ngModel)]="model.test">
 *  ```
 */
@Directive({
    selector: "MaskedTextField[ngModel], MaskedTextField[formControlName], maskedTextField[ngModel], maskedTextField[formControlName], masked-text-field[ngModel], masked-text-field[formControlName]",
    providers: [MASKED_TEXT_VALUE_ACCESSOR]
})
export class MaskedTextValueAccessor extends TextValueAccessor {
    // Empty as we will use the same logic as the TextValueAccessor 
}

@NgModule({
    declarations: [MaskedTextValueAccessor],
    providers: [],
    imports: [
        FormsModule
    ],
    exports: [
        FormsModule,
        MaskedTextValueAccessor
    ]
})
export class MaskedTextFieldModule {
}