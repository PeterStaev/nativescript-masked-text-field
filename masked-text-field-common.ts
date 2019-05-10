/*! *****************************************************************************
Copyright (c) 2019 Tangra Inc.

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
import { CSSType, CoercibleProperty, Property } from "ui/core/view";
import { TextField } from "ui/text-field";

import { MaskedTextField as MaskedTextFieldDefinition } from ".";

export * from "ui/text-field";

// Dummy interface to allow call of private function in TextField
export interface MaskedTextFieldBase {
    _setInputType(inputType: number): void;
}

@CSSType("MaskedTextField")
export abstract class MaskedTextFieldBase extends TextField implements MaskedTextFieldDefinition {
    public mask: string;
    public text: string;

    public _emptyMaskedValue: string = "";
    private _placeholder: string = "_";
    private _tokenRulesMap: { [key: string]: RegExp } = {
        "0": /\d/,
        "9": /\d|\s/,
        "#": /\d|\s|\+|\-/,
        "L": /[a-zA-Z]/,
        "?": /[a-zA-Z]|\s/,
        "&": /\S/,
        "C": /./,
        "A": /[a-zA-Z0-9]/,
        "a": /[a-zA-Z0-9]|\s/
    };
    private _maskTokens: Array<string | RegExp> = [];

    public _updateMaskedText(start: number, previousCharactersCount: number, newText: string, isBackwardsIn: boolean): number {
        const unmaskedChangedValue = this._getUnmaskedValue(newText, start);
        const newMaskedValue = this._getNewMaskedValue(start, start + previousCharactersCount, unmaskedChangedValue, isBackwardsIn);

        // NOTE: Do not set directly the owner.text property as this will trigger an unnecessary coerce value and masking/unmasking!            
        this._setNativeText(newMaskedValue);
        textProperty.nativeValueChange(this, newMaskedValue);

        let newCaretPosition = this._getNextRegExpToken(start, isBackwardsIn);
        if (newCaretPosition === -1) {
            // Current caret is outside RegExp token, so leave where it is currently
            newCaretPosition = start + (isBackwardsIn ? 1 : 0);
        }
        else {
            newCaretPosition = this._getNextRegExpToken(newCaretPosition + unmaskedChangedValue.length, isBackwardsIn);
            if (newCaretPosition === -1) {
                // There are no next RegExp tokens, go to end/start
                newCaretPosition = this._getNextRegExpToken((isBackwardsIn ? 0 : newMaskedValue.length - 1), !isBackwardsIn)
                    + (!isBackwardsIn ? 1 : 0);
            }
        }

        return newCaretPosition;
    }

    public _generateMaskTokens() {
        const maskChars = this.mask.split("");
        const emptyMaskedValueBuider: string[] = [];
        let isEscapeCharIn = false;

        this._maskTokens.length = 0;
        for (const char of maskChars) {
            if (isEscapeCharIn) {
                isEscapeCharIn = false;
                this._maskTokens.push(char);
                emptyMaskedValueBuider.push(char);
                continue;
            }

            if (char === "\\") {
                isEscapeCharIn = true;
                continue;
            }

            const tokenRule = this._tokenRulesMap[char];
            this._maskTokens.push(tokenRule || char);
            emptyMaskedValueBuider.push(tokenRule ? this._placeholder : char);
        }

        this._emptyMaskedValue = emptyMaskedValueBuider.join("");
    }

    public _getUnmaskedValue(value: any, startTokenIndex?: number) {
        if (!value) {
            return "";
        }

        const resultBuilder: string[] = [];
        const chars = value.toString().split("");
        let tokenLoop = startTokenIndex || 0;
        let charLoop = 0;

        while (tokenLoop < this._maskTokens.length && charLoop < chars.length) {
            const char = chars[charLoop];
            const token = this._maskTokens[tokenLoop];

            if (char === token || char === this._placeholder) {
                if (char === this._placeholder) {
                    resultBuilder.push(this._placeholder);
                }
                tokenLoop++;
                charLoop++;
                continue;
            }

            if (token instanceof RegExp) {
                if (token.test(char)) {
                    resultBuilder.push(char);
                    tokenLoop++;
                }
                charLoop++;
                continue;
            }

            tokenLoop++;
        }

        return resultBuilder.join("");
    }

    public _getNewMaskedValue(replaceStart: number, replaceEnd: number, unmaskedReplaceValue: string, isBackwardsIn?: boolean) {
        replaceStart = this._getNextRegExpToken(replaceStart, isBackwardsIn);
        if (replaceStart > replaceEnd) {
            replaceEnd = replaceStart;
        }

        const currentValue = this.text || this._emptyMaskedValue;
        const unmaskedValueAndSuffix =
            unmaskedReplaceValue + this._getUnmaskedValue(currentValue.substring(replaceEnd), replaceEnd);
        const unmaskedValueAndSuffixSplit = unmaskedValueAndSuffix.split("");
        const currentValueSplit = currentValue.split("");

        for (let loop = replaceStart, charLoop = 0; loop > -1 && loop < this._emptyMaskedValue.length; loop = this._getNextRegExpToken(loop + 1), charLoop++) {
            currentValueSplit[loop] = unmaskedValueAndSuffixSplit[charLoop] || this._placeholder;
        }

        return currentValueSplit.join("");        
    }

    protected abstract _setNativeText(value: string);

    private _getNextRegExpToken(start: number, isBackwardsIn?: boolean) {
        const step = (isBackwardsIn ? -1 : 1);

        for (let loop = start; loop > -1 && loop < this._maskTokens.length; loop += step) {
            if (this._maskTokens[loop] instanceof RegExp) {
                return loop;
            }
        }

        return -1;
    }
}

export const maskProperty = new Property<MaskedTextFieldBase, string>({
    name: "mask",
    defaultValue: "",
    valueChanged: (target, oldValue, newValue) => {
        target._generateMaskTokens();
    }
});
maskProperty.register(MaskedTextFieldBase);

export const textProperty = new CoercibleProperty<MaskedTextFieldBase, string>({
    name: "text",
    defaultValue: null,
    coerceValue: (target, value) => {
        if (!target._emptyMaskedValue) {
            return value;
        }

        const unmaskedValue = target._getUnmaskedValue(value);
        return target._getNewMaskedValue(0, target._emptyMaskedValue.length, unmaskedValue);
    }
});
textProperty.register(MaskedTextFieldBase);