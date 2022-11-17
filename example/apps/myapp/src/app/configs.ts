import { TranslateLoader, TranslateModuleConfig } from '@ngx-translate/core';
import {
  RestClientOptions,
  VtsRestModuleConfig,
} from '@vts-kit/angular-network';
import { from, Observable } from 'rxjs';

/**
 * Network Module Config
 */
export const NETWORK_MODULE_CONFIG: VtsRestModuleConfig = {
  defaultConfig: new RestClientOptions().setBaseUrl('https://<base_api_url>'),
};

/**
 * Translate Module Config
 */
class TranslateHttpLoader extends TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return from(fetch(`./assets/locale/${lang}.json`).then((d) => d.json()));
  }
}

export const TRANSLATE_MODULE_CONFIG: TranslateModuleConfig = {
  defaultLanguage: 'vi',
  loader: {
    provide: TranslateLoader,
    useClass: TranslateHttpLoader,
  },
};
