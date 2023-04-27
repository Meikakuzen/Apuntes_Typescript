import type {Config} from '@jest/types'

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: 'node',
    verbose: true //mostrará mñas info en la consola
}

export default config