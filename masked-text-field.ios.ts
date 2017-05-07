/*! *****************************************************************************
Copyright (c) 2017 Tangra Inc.

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
    private _delegate: any;

    constructor() {
        super(); // NOTE: This initializes this._delegate!
        this._delegate = MaskedTextFieldDelegate.initWithOwnerAndDefaultImplementation(new WeakRef(this), this._delegate);
    }

    public [textProperty.getDefault]() {
        return "";
    }

    public [textProperty.setNative](value: string) {
        this._setNativeText(value);
    }

    public _setNativeText(value: string) {
        const style = this.style;

        const dict = new Map<string, any>();
        switch (style.textDecoration) {
            case "none":
                break;
            case "underline":
                dict.set(NSUnderlineStyleAttributeName, NSUnderlineStyle.StyleSingle);
                break;
            case "line-through":
                dict.set(NSStrikethroughStyleAttributeName, NSUnderlineStyle.StyleSingle);
                break;
            case "underline line-through":
                dict.set(NSUnderlineStyleAttributeName, NSUnderlineStyle.StyleSingle);
                dict.set(NSStrikethroughStyleAttributeName, NSUnderlineStyle.StyleSingle);
                break;
            default:
                throw new Error(`Invalid text decoration value: ${style.textDecoration}. Valid values are: 'none', 'underline', 'line-through', 'underline line-through'.`);
        }

        if (style.letterSpacing !== 0) {
            dict.set(NSKernAttributeName, style.letterSpacing * this.nativeView.font.pointSize);
        }

        if (style.color) {
            dict.set(NSForegroundColorAttributeName, style.color.ios);
        }

        const stringValue = (value === undefined || value === null) ? "" : value.toString();
        const source = getTransformedText(stringValue, this.textTransform);
        if (dict.size > 0) {
            const result = NSMutableAttributedString.alloc().initWithString(source);

            result.setAttributesRange(dict as any, { location: 0, length: source.length });
            this.nativeView.attributedText = result;
        }
        else {
            // Clear attributedText or text won't be affected.
            this.nativeView.attributedText = undefined;
            this.nativeView.text = source;
        }
    }
}

class MaskedTextFieldDelegate extends NSObject implements UITextFieldDelegate {
    public static ObjCProtocols = [UITextFieldDelegate];

    public static initWithOwnerAndDefaultImplementation(owner: WeakRef<MaskedTextField>, defaultImplementation: UITextFieldDelegate): MaskedTextFieldDelegate {
        const delegate = MaskedTextFieldDelegate.new() as MaskedTextFieldDelegate;
        delegate._owner = owner;
        delegate._defaultImplementation = defaultImplementation;
        return delegate;
    }

    private _owner: WeakRef<MaskedTextField>;
    private _defaultImplementation: UITextFieldDelegate;

    public textFieldShouldBeginEditing(textField: UITextField): boolean {
        return this._defaultImplementation.textFieldShouldBeginEditing(textField);
    }

    public textFieldDidEndEditing(textField: UITextField) {
        this._defaultImplementation.textFieldDidEndEditing(textField);
    }

    public textFieldShouldClear(textField: UITextField): boolean {
       return  this._defaultImplementation.textFieldShouldClear(textField);
    }

    public textFieldShouldReturn(textField: UITextField): boolean {
        return this._defaultImplementation.textFieldShouldReturn(textField);
    }

    public textFieldShouldChangeCharactersInRangeReplacementString(textField: UITextField, range: NSRange, replacementString: string): boolean {
        const owner = this._owner.get();
        const isBackwardsIn: boolean = (replacementString === "");
        const newCaretPositionNumber = owner._updateMaskedText(range.location, range.length, replacementString, isBackwardsIn);
        
        const caretPosition = textField.positionFromPositionOffset(textField.beginningOfDocument, newCaretPositionNumber);        
        textField.selectedTextRange = textField.textRangeFromPositionToPosition(caretPosition, caretPosition);

        return false; // Always return false as we change the text ourselves, so no automatic change should happen. 
    }
}