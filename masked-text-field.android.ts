/*! *****************************************************************************
Copyright (c) 2018 Tangra Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
***************************************************************************** */
import { getTransformedText } from "ui/text-base";

import { MaskedTextFieldBase, textProperty } from "./masked-text-field-common";

export * from "./masked-text-field-common";

export class MaskedTextField extends MaskedTextFieldBase {
    public _isChangingNativeTextIn: boolean = false;

    public createNativeView() {
        const textEdit: android.widget.EditText = super.createNativeView() as android.widget.EditText;

        const textWatcher = new MaskedTextFieldTextWatcher(new WeakRef(this));
        textEdit.addTextChangedListener(textWatcher);
        (textEdit as any).textWatcher = textWatcher;
        
        // Remote the default text watcher that comes from the core modules
        //  as it update the value in the wrong place with the wrong one
        textEdit.removeTextChangedListener((textEdit as any).listener);
        
        return textEdit;
    }

    public initNativeView() {
        super.initNativeView();

        const nativeView = this.nativeView as any;
        nativeView.textWatcher.owner = new WeakRef(this);
    }

    public disposeNativeView() {
        const nativeView = this.nativeView as any;
        nativeView.textWatcher.owner = null;

        super.disposeNativeView();
    }
    
    public [textProperty.getDefault]() {
        this.nativeView.getText();
    }

    public [textProperty.setNative](value: string) {
        this._setNativeText(value);
    }

    public _setNativeText(value: string) {
        const stringValue = (value === null || value === undefined) ? "" : value.toString();
        const transformedText = getTransformedText(stringValue, this.textTransform);

        this._isChangingNativeTextIn = true;        
        this.nativeView.setText(transformedText);
        this._isChangingNativeTextIn = false;
    }
}

@Interfaces([android.text.TextWatcher])
class MaskedTextFieldTextWatcher extends java.lang.Object implements android.text.TextWatcher {
    constructor(private owner: WeakRef<MaskedTextField>) {
        super();

        return global.__native(this);
    }
    
    public beforeTextChanged(s: string /* java.lang.CharSequence */, start: number, count: number, after: number) {
        // NOT NEEDED
    }

    public onTextChanged(s: string /* java.lang.CharSequence */, start: number, before: number, count: number) {
        const owner = this.owner.get();
        if (!owner._isChangingNativeTextIn) {
            const changedText = s.toString().substr(start, count);
            const isBackwardsIn: boolean = (count === 0);
            const newCaretPosition = owner._updateMaskedText(start, before, changedText, isBackwardsIn);
            const editText: android.widget.EditText = owner.nativeView as android.widget.EditText;
            editText.setSelection(newCaretPosition);
        }    
    }

    public afterTextChanged(s: any): void {
        // NOT NEEDED
    }    
}