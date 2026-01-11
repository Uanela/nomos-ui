// import { configureStore } from "@reduxjs/toolkit";
// import api from "./api";
// import authApi from "./apis/auth.api";
// import appSlice from "./app.slice";

// export const store = configureStore({
//   reducer: {
//     [api.reducerPath]: api.reducer,
//     [authApi.reducerPath]: authApi.reducer,
//     app: appSlice.reducer,
//   },
//   middleware: (getDefaultMiddleWare) =>
//     getDefaultMiddleWare({
//       serializableCheck: {
//         ignoredActionPaths: [
//           "payload.func",
//           "meta.arg",
//           "payload.timestamp",
//           "meta.baseQueryMeta",
//         ],
//         ignoredPaths: ["items.dates"],
//       },
//     })
//       .concat(api.middleware)
//       .concat(authApi.middleware),
// });

// export type AppStore = typeof store;
// export type RootState = ReturnType<AppStore["getState"]>;
// export type AppDispatch = AppStore["dispatch"];
