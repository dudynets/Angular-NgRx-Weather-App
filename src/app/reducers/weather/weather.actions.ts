import { WeatherState } from './weather.reducer';
import { Action } from "@ngrx/store";

export enum weatherActionsType {
    getWeather = '[WEATHER] getWeather',
    getWeatherSuccess = '[WEATHER] getWeatherSuccess'
};

export class GetWeatherAction implements Action {
    readonly type = weatherActionsType.getWeather;
    constructor(public payload: string) {}
}

export class GetWeatherSuccessAction implements Action {
    readonly type = weatherActionsType.getWeatherSuccess;
    constructor(public payload: WeatherState) {}
}

export type WeatherActions = GetWeatherAction | GetWeatherSuccessAction;