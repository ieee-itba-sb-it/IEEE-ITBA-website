import {Pipe, PipeTransform} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {InternationalText} from "../models/data-types";

// This pipe is used to translate text that is stored in the database
@Pipe({ name: "customTranslate", pure: false })
export class CustomTranslatePipe implements PipeTransform {
    constructor(private readonly translate: TranslateService) {}

    transform(text: InternationalText): string {
        return text[this.locale()];
    }

    private locale(): string {
        return this.translate.currentLang;
    }

}
