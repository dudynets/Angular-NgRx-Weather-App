import { WeatherState, weatherReducer, weatherNode } from './weather/weather.reducer';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

export interface State {
  [weatherNode]: WeatherState;
}

export const reducers: ActionReducerMap<State> = {
  [weatherNode]: weatherReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
