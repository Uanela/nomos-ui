// import appSlice from "@/packages/uanela-redux/src/app.slice";
// import { fetchBaseQuery } from "@reduxjs/toolkit/query";

// export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// const baseQuery = async (args: any, api: any, extraOptions: any) => {
//   const fetchBase = fetchBaseQuery({
//     baseUrl: `${apiUrl}/api`,
//     credentials: "include",
//   });

//   const result = await fetchBase(args, api, extraOptions);

//   if (
//     result.error &&
//     result.error.status === 401 &&
//     (result.error as any).data.message.toLowerCase().includes("invalid token")
//   ) {
//     const requestUrl = typeof args === "string" ? args : args.url;

//     if (!requestUrl.includes("/auth"))
//       api.dispatch(appSlice.actions.setSessionExpired(true));
//   }

//   return result;
// };

// export default baseQuery;
