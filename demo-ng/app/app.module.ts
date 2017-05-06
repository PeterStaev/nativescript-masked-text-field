import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { MaskedTextFieldModule } from "nativescript-masked-text-field/angular";

import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { MaskedTextFieldComponent } from "./maskedtextfield/maskedtextfield.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        MaskedTextFieldModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        MaskedTextFieldComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
