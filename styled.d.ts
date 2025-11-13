import 'styled-components'
import { Theme } from './types/Theme.types'

declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}
