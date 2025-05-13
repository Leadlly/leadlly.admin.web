import { createSlice } from "@reduxjs/toolkit";

export interface InstituteProps {
  institute: any;
}

const initialState: InstituteProps = {
  institute: null
};

export const instituteSlice = createSlice({
  name: "institute",
  initialState,
  reducers: {
    instituteData: (state, action) => {
      state.institute = action.payload;
    },
  },
});

export const { instituteData } = instituteSlice.actions;

export default instituteSlice.reducer;