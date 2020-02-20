import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as matrixReducer } from '../Features/Matrix/reducer';
import { reducer as chartReducer } from '../Features/Chart/reducer';

export default {
  weather: weatherReducer,
  matrix: matrixReducer,
  chart: chartReducer,
};
