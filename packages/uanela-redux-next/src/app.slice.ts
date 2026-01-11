// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// // Define initial state type
// interface AppState {
//   template?: {
//     name: string;
//     data: Record<string, any>;
//   };
//   sessionExpired?: boolean;
//   previousUrl?: string;
//   runOnUrlChange?: { func: Function }[];
// }

// // Initial state with default structure
// const initialState: AppState = {
//   template: {
//     name: "",
//     data: {},
//   },
//   runOnUrlChange: [],
//   previousUrl: "",
// };

// // Create the slice
// const appSlice = createSlice({
//   name: "app",
//   initialState,
//   reducers: {
//     setTemplate: (
//       state,
//       action: PayloadAction<{ name: string; data: Record<string, any> }>
//     ) => {
//       state.template = action.payload;
//     },
//     updateTemplateData: (state, action: PayloadAction<Record<string, any>>) => {
//       if (state.template) {
//         state.template.data = { ...state.template.data, ...action.payload };
//       }
//     },
//     clearTemplate: (state) => {
//       state.template = { name: "", data: {} };
//     },
//     setSessionExpired: (state, action: PayloadAction<boolean>) => {
//       state.sessionExpired = action.payload;
//     },
//     pushToRunOnUrlChange: (state, action: PayloadAction<any>) => {
//       state.runOnUrlChange?.push(action.payload);
//     },
//     cleanOnUrlChange: (state) => {
//       state.runOnUrlChange = [];
//     },
//     setPreviousUrl: (state, action: PayloadAction<string>) => {
//       state.previousUrl = action.payload;
//     },
//   },
// });

// // Export actions
// export const {
//   setTemplate,
//   updateTemplateData,
//   clearTemplate,
//   cleanOnUrlChange,
//   pushToRunOnUrlChange,
//   setPreviousUrl,
// } = appSlice.actions;

// // Export reducer
// export default appSlice;
