import { Directive, NgModule, forwardRef } from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { registerElement } from "nativescript-angular/element-registry";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { TextValueAccessor } from "nativescript-angular/forms/value-accessors/text-value-accessor";

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
    selector:
    "MaskedTextField[ngModel], MaskedTextField[formControlName], MaskedTextField[formControl]" +
    "maskedTextField[ngModel], maskedTextField[formControlName], maskedTextField[formControl]" +
    "masked-text-field[ngModel], masked-text-field[formControlName], masked-text-field[formControl]",
    providers: [MASKED_TEXT_VALUE_ACCESSOR],
    host: {
        "(touch)": "onTouched()",
        "(textChange)": "onChange($event.value)"
    }
})
export class MaskedTextValueAccessor extends TextValueAccessor {
    // Empty as we will use the same logic as the TextValueAccessor 
}

@NgModule({
    declarations: [
        MaskedTextValueAccessor
    ],
    providers: [],
    imports: [
        FormsModule,
        NativeScriptFormsModule
    ],
    exports: [
        FormsModule,
        MaskedTextValueAccessor
    ]
})
export class MaskedTextFieldModule {
}
