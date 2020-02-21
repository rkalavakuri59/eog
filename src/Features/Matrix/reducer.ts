import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Matrix = {
  matrix: [];
};
export type SelectedMatrix = {
  selectedMatrix: string[];
};

export type ApiErrorAction = {
  error: string;
};

interface InitialState {
  matrix: any[];
  selectedMatrix: string[];
}

const initialState: InitialState = {
  matrix: [],
  selectedMatrix: [],
};

const slice = createSlice({
  name: 'matrix',
  initialState,
  reducers: {
    matrixDataRecevied: (state, action: PayloadAction<Matrix>) => {
      const { matrix } = action.payload;
      state.matrix = matrix;
    },
    matrixUpdateSelectedValue: (state, action: PayloadAction<SelectedMatrix>) => {
      const selectedMatrix: string[] = action.payload.selectedMatrix;
      state.selectedMatrix = selectedMatrix;
    },
    matrixApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
