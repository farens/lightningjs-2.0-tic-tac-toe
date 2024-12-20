import { Lightning, Launch, PlatformSettings, AppData } from '@lightningjs/sdk'
import App from './App'

export default function (
  appSettings: Lightning.Application.Options,
  platformSettings: PlatformSettings,
  appData: AppData,
) {
  return Launch(App, appSettings, platformSettings, appData)
}
