import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IInstitute } from "@/helpers/types";

export interface InstituteProps {
  institute: IInstitute | null;
}

const initialState: InstituteProps = {
  institute: null,
};

export const instituteSlice = createSlice({
  name: "institute",
  initialState,
  reducers: {
    instituteData: (state, action: PayloadAction<IInstitute | null>) => {
      state.institute = action.payload;
    },
  },
});

export const { instituteData } = instituteSlice.actions;

export default instituteSlice.reducer;
