// import { createApi } from "@reduxjs/toolkit/query/react";
// // import { toastError } from "../helpers/toast.helpers";
// import baseQuery from "../utils/base-query";

// // Create a separate API instance for auth
// export const authApi = createApi({
//   reducerPath: "authApi",
//   baseQuery,
//   tagTypes: ["user"],
//   endpoints: (builder) => ({
//     getMe: builder.query({
//       query: () => "/users/me",
//       transformErrorResponse: (res) => {
//         return res;
//       },
//       providesTags: (result, err, arg) => {
//         return err ? [] : [{ type: "user", id: "me" }];
//       },
//     }),
//     updateMe: builder.mutation({
//       query: (body) => ({
//         url: `/users/me`,
//         method: "PATCH",
//         body: body,
//       }),
//       invalidatesTags: (result, err, arg) =>
//         err ? [] : [{ type: "user", id: "me" }],
//     }),
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: "/auth/login",
//         method: "POST",
//         body: credentials,
//       }),
//       transformResponse: async (res, meta, arg) => {
//         // if (res?.accessToken)
//         //   await secureStore.setItemAsync("accessToken", res.accessToken);
//         // else throw new Error("Nenhum token de acesso retornado!");
//         return res;
//       },
//       transformErrorResponse: (res, meta, args) => {
//         if (res.status === 401) {
//           // toastError(
//           //   "Email ou palavra-passe errada, por favor digite dados corretos!"
//           // );
//         } else {
//           // toastError(
//           //   "Ocorreu um erro fazendo o login, por favor tente novamente!"
//           // );
//         }
//         return res;
//       },
//       invalidatesTags: (result, err, args) => {
//         return err ? [] : [{ type: "user", id: "me" }];
//       },
//     }),
//     logout: builder.mutation({
//       query: () => ({
//         url: "/auth/logout",
//         method: "DELETE",
//       }),
//       invalidatesTags: (result, err, args) => {
//         if (err) return [];
//         return [{ type: "user", id: "me" }];
//       },
//     }),
//     signup: builder.mutation({
//       query: (data) => ({
//         url: "/auth/signup",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: (result, err, args) => {
//         return err ? [] : [{ type: "user", id: "me" }];
//       },
//     }),
//     verifyEmail: builder.mutation({
//       query: (data) => ({
//         url: "/auth/signup",
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: (result, err, args) => {
//         return err ? [] : [{ type: "user", id: "me" }];
//       },
//     }),
//     forgotPassword: builder.mutation({
//       query: (data) => ({
//         url: "/auth/forgot-password",
//         method: "POST",
//         body: data,
//       }),
//     }),
//     resetPassword: builder.mutation({
//       query: (data) => ({
//         url: "/auth/reset-password",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: (result, err, args) => {
//         return err ? [] : [{ type: "user", id: "me" }];
//       },
//     }),
//   }),
// });

// export default authApi;
