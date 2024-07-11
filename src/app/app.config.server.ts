import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

/**
 * Server Config
 */
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};
/**
 * Config
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
