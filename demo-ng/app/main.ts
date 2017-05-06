// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
// import { registerElement } from "nativescript-angular/element-registry";

// registerElement("MaskedTextField", () => require("nativescript-masked-text-field/masked-text-field").MaskedTextField);

import { AppModule } from "./app.module";

platformNativeScriptDynamic().bootstrapModule(AppModule);
