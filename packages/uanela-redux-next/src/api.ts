// import {
//   buildCreateApi,
//   coreModule,
//   reactHooksModule,
//   TypedMutationTrigger,
//   TypedUseMutationResult,
//   TypedUseQueryStateResult,
// } from "@reduxjs/toolkit/query/react";
// import { camelCase, pascalCase } from "change-case-all";
// import pluralize, { singular } from "pluralize";
// import { ApiDataResponse, ApiEndpoitBuilder, ListTag, TagType } from "./types";
// import baseQuery from "./utils/base-query";
// import { toastError, toastSuccess } from "@/src/utils/redux/utils/toast";

// export const tagTypes: TagType[] = ["user", "post", "activity"] as const;

// const createApi = buildCreateApi(
//   coreModule(),
//   reactHooksModule({ unstable__sideEffectsInRender: true })
// );

// const api = createApi({
//   reducerPath: "api",
//   baseQuery,
//   tagTypes: tagTypes.map((tag) => {
//     if (typeof tag === "string") return tag;
//     return tag.tagType;
//   }),
//   endpoints: (builder) =>
//     tagTypes.reduce((acc, type) => {
//       return {
//         ...acc,
//         ...createEndpointsForTagType(builder, type),
//       };
//     }, {}),
// });

// function createEndpointsForTagType(builder: ApiEndpoitBuilder, tag: TagType) {
//   let name: string;
//   let url: string;
//   let tagType: string;
//   let listTag: (ListTag | ListTag[])[];
//   let getAdditionalTagsFromResult: (result: Record<string, any>) => ListTag[];

//   if (typeof tag === "string") {
//     name = pascalCase(tag);
//     url = `/${pluralize(tag)}`;
//     tagType = tag;
//     listTag = [{ type: tag, id: `${pluralize(tag)}-list` }];
//     getAdditionalTagsFromResult = () => [];
//   } else {
//     name = pascalCase(tag.name);
//     url = `/${tag.url}`;
//     tagType = tag.tagType;
//     listTag =
//       (tag.listTag as ListTag[]).length > 0
//         ? [...(tag.listTag as ListTag[])]
//         : [tag.listTag];
//     getAdditionalTagsFromResult = tag.getAdditionalTagsFromResult || (() => []);
//   }

//   return {
//     [`create${name}`]: builder.mutation({
//       query: (data: any) => {
//         const { configs, ...body } = data;
//         if (data instanceof FormData) {
//           return {
//             url: `${url}`,
//             method: "POST",
//             body: data,
//             headers: {},
//           };
//         }

//         return {
//           url: `${url}`,
//           method: "POST",
//           body,
//         };
//       },
//       transformResponse: (res, meta, args) => {
//         if (res && (args as any)?.configs?.toastSuccess !== false)
//           toastSuccess(`Created successfully!`);
//         return res;
//       },
//       transformErrorResponse: (res, meta, args) => {
//         if (res && (args as any)?.configs?.toastError !== false)
//           toastError(
//             `Ocorreu um erro ao criar ${name}, ${
//               (res.data as { message: string; [x: string]: any })?.message
//             }`
//           );
//         return res;
//       },
//       invalidatesTags: (result, err, arg) =>
//         err ? [] : ([...listTag] as any[]),
//     }),
//     [`get${name}`]: builder.query({
//       query: ({ id, ...searchParams }) => {
//         return `${url}/${id}?${convertToSearchParams(searchParams, "", {
//           keepAll: true,
//         })}`;
//       },
//       transformErrorResponse: (res, meta, args) => {
//         if (res && (args as any)?.configs?.toastError !== false)
//           toastError(
//             `Ocorreu um erro ao carregar os dados de ${name}, ${
//               (res.data as { message: string; [x: string]: any })?.message
//             }`
//           );
//         return res;
//       },
//       providesTags: (result, err, arg) =>
//         err ? [] : [{ type: tagType as string, id: (arg as any).id as string }],
//     }),
//     [`update${name}`]: builder.mutation<any, any>({
//       query: ({ id, body }: { id: string; body: Record<string, any> }) => {
//         delete body?.id;
//         return {
//           url: `${url}/${id}`,
//           method: "PATCH",
//           body: body,
//         };
//       },
//       transformResponse: (res, meta, args) => {
//         if (res && args?.configs?.toast !== false)
//           toastSuccess(`Update successfully`);
//         return res;
//       },
//       transformErrorResponse: (res) => {
//         toastError(
//           `Ocorreu um erro ao atualizar ${name}, ${
//             (res.data as { message: string; [x: string]: any })?.message
//           }`
//         );
//         return res;
//       },
//       invalidatesTags: (result, err, arg) =>
//         err
//           ? []
//           : [
//               { type: tagType, id: result?.data?.id },
//               ...getAdditionalTagsFromResult(result),
//             ],
//     }),
//     [`updateOptimistic${name}`]: builder.mutation<any, any>({
//       query: ({ id, body }) => ({
//         url: `${url}/${id}`,
//         method: "PATCH",
//         body: body,
//       }),

//       invalidatesTags: (result, err, { id }) =>
//         err
//           ? []
//           : [
//               { type: tagType, id: result?.data?.id },
//               ...getAdditionalTagsFromResult(result),
//             ],
//       async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
//         const endpointName = `get${pluralize(name)}`;
//         const patchResult = dispatch(
//           api.util.updateQueryData(
//             endpointName as never,
//             undefined as never,
//             (draft: any) => {
//               const item = draft?.data?.find((item: any) => item.id === id);
//               if (item) {
//                 Object.assign(item, body);
//               }
//             }
//           )
//         );
//         try {
//           await queryFulfilled;
//           toastSuccess(`${singular(name)}, atualizado com sucesso!`);
//         } catch (err) {
//           toastError(`Ocorreu um erro ao atualizar ${name}`);
//           patchResult.undo();
//         }
//       },
//     }),
//     [`delete${name}`]: builder.mutation<any, any>({
//       query: ({ id }) => ({
//         url: `${url}/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (result, err, arg) => {
//         try {
//           return err
//             ? []
//             : [
//                 { type: tagType, id: arg.id },
//                 ...getAdditionalTagsFromResult(result),
//               ];
//         } catch (err) {
//           return [];
//         }
//       },
//       async onQueryStarted(arg, { dispatch, queryFulfilled, ...rest }) {
//         const endpointName = `get${pluralize(name)}`;
//         let patchResult = dispatch(
//           api.util.updateQueryData(
//             endpointName as never,
//             undefined as never,
//             (draft: any) => {
//               if (draft?.data) {
//                 draft.data = draft.data.filter((item: any) => item.id !== arg);
//               }
//             }
//           )
//         );
//         try {
//           if (!arg?.includes?.("http")) {
//             await queryFulfilled;
//             toastSuccess(`Deleted successfully`);
//           }
//         } catch (res: any) {
//           toastError(
//             `Error deleting${res.error.data.message ? `, ${res.error.data.message.toLowerCase()}` : ""}`
//           );
//           patchResult.undo();
//         }
//       },
//     }),
//     [`get${pluralize(name)}`]: builder.query<any, any>({
//       query: ({ configs, ...searchParams } = {}) => {
//         searchParams = { sort: "-createdAt", ...searchParams };

//         return `${url}?${convertToSearchParams(searchParams, "", {
//           keepAll: true,
//         })}`;
//       },
//       transformErrorResponse: (res, meta, args) => {
//         if (
//           res &&
//           (args?.configs?.toast !== false ||
//             args?.configs?.toastError !== false)
//         )
//           toastError(
//             `Ocorreu um erro ao carregar os dados de ${pluralize(name)}, ${
//               (res.data as { message: string; [x: string]: any })?.message
//             }`
//           );
//         return res;
//       },
//       providesTags: (result, err, arg) => {
//         if (err) return [];
//         return [
//           ...listTag,
//           ...(result?.data?.map?.(
//             ({ id }: Partial<{ id: string | number }>) => ({
//               type: tagType,
//               id,
//             })
//           ) || []),
//         ];
//       },
//     }),
//   };
// }

// tagTypes.forEach((tag) => {
//   let name;
//   let url;
//   let tagType;
//   let listTag;
//   let getAdditionalTagsFromResult;

//   if (typeof tag === "string") {
//     name = pascalCase(tag);
//     url = `/${pluralize(tag)}`;
//     tagType = tag;
//     listTag = [{ type: tag, id: `${pluralize(tag)}-list` }];
//     getAdditionalTagsFromResult = () => [];
//   } else {
//     name = pascalCase(tag.name);
//     url = `/${tag.url}`;
//     tagType = tag.tagType;
//     listTag =
//       (tag.listTag as ListTag[]).length > 0
//         ? [...(tag.listTag as ListTag[])]
//         : [tag.listTag];
//     getAdditionalTagsFromResult = tag.getAdditionalTagsFromResult || (() => []);
//   }

//   (api as any)[camelCase(name as string)] = {
//     useCreateOne: (api as any)[`useCreate${name}Mutation`],
//     useGetOne: (api as any)[`useGet${name}Query`],
//     useUpdateOne: (api as any)[`useUpdate${name}Mutation`],
//     useUpdateOneOptimistic: (api as any)[`useUpdateOptimistic${name}Mutation`],
//     useDeleteOne: (api as any)[`useDelete${name}Mutation`],
//     useGetMany: (api as any)[`useGet${pluralize(name)}Query`],
//   };
// });

// type TypeUseMutationIterator<T> = [
//   TypedMutationTrigger<ApiDataResponse<T>, any, any>,
//   TypedUseMutationResult<ApiDataResponse<T>, any, any>,
// ];

// interface ApiEndpoint {
//   useCreateOne<T>(params?: Record<string, any>): TypeUseMutationIterator<T>;
//   useGetOne<T>(
//     params?: Record<string, any>
//   ): TypedUseQueryStateResult<ApiDataResponse<T>, any, any>;
//   useUpdateOne<T>(params?: Record<string, any>): TypeUseMutationIterator<T>;
//   useUpdateOneOptimistic<T>(
//     params?: Record<string, any>
//   ): TypeUseMutationIterator<T>;
//   useDeleteOne<T>(params?: Record<string, any>): TypeUseMutationIterator<T>;
//   useGetMany<T>(
//     params?: Record<string, any>
//   ): TypedUseQueryStateResult<ApiDataResponse<T>, any, any>;
// }

// export default api as typeof api & Record<string, ApiEndpoint>;

// export function convertToSearchParams(
//   obj: Record<string, any>,
//   parentKey = "",
//   options: { keepAll: boolean } = { keepAll: false }
// ): string {
//   const params: string[] = [];

//   for (const [key, value] of Object.entries(obj)) {
//     const fullKey = parentKey ? `${parentKey}[${key}]` : key;

//     if (typeof value === "object" && value !== null)
//       params.push(convertToSearchParams(value, fullKey, options));
//     else if (
//       options?.keepAll ||
//       (!fullKey.includes("[mode]") &&
//         typeof value === "string" &&
//         value !== "insensitive")
//     )
//       params.push(
//         `${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`
//       );
//   }

//   return params.join("&");
// }
