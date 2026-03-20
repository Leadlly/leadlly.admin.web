import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IAdmin } from "@/helpers/types";

export interface UserProps {
  user: IAdmin | null;
}

const initialState: UserProps = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userData: (state, action: PayloadAction<IAdmin | null>) => {
      state.user = action.payload;
    },
  },
});

export const { userData } = userSlice.actions;

export default userSlice.reducer;
