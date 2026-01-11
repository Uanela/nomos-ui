import {
  Api,
  BaseQueryFn,
  coreModuleName,
  EndpointBuilder,
  EndpointDefinition,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
} from "@reduxjs/toolkit/query";
import { reactHooksModuleName } from "@reduxjs/toolkit/query/react";

export type ApiDataResponse<T> = {
  data: T;
  total?: number;
  results?: number;
};

export type ListTag = { type: string; id: string };

export type TagType =
  | string
  | {
      name: string;
      url: string;
      tagType: string;
      listTag: ListTag | ListTag[];
      getAdditionalTagsFromResult?: (result: Record<string, any>) => ListTag[];
    };

export type Mutation = MutationDefinition<
  any,
  BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
  >,
  string,
  any,
  "api"
>;

type EndpointHooks = {
  [x: string]: EndpointDefinition<any, any, any, any, string>;
};

export type BaseApi = Api<
  BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
  >,
  EndpointHooks,
  "api",
  string,
  typeof coreModuleName | typeof reactHooksModuleName
>;

export type ApiEndpoitBuilder = EndpointBuilder<
  BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
  >,
  string,
  "api"
>;
