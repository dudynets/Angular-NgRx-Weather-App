import { createFeatureSelector, createSelector } from "@ngrx/store";
import { weatherNode, WeatherState } from "./weather.reducer";

const selectWeatherFeature = createFeatureSelector<WeatherState>(weatherNode);

export const selectWeatherState = createSelector(
    selectWeatherFeature,
    (state: WeatherState): WeatherState => state
);