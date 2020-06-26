import { appendQueryString, HttpMethod, NETWORK_ERROR_CODE, urlJoin } from "./utils";
import { Injectable } from "react.di";
import { NetworkError, NetworkResponse } from "./NetworkResponse";

export interface FetchInfo {
  path?: string;
  method?: HttpMethod;
  queryParams?: any;
  body?: any;
  headers?: {[s: string]: string};
  mode?: RequestMode;
  token?: string;
}

declare var APIROOTURL: string;

@Injectable
export class HttpService {

  token: string  = "";

  async fetchRaw(fetchInfo: FetchInfo = {}): Promise<Response> {
    const body = fetchInfo.body
      ? {body: fetchInfo.body}
      : null;

    const mode = fetchInfo.mode
    ? { mode: fetchInfo.mode}
    : {};

    return await fetch(appendQueryString(fetchInfo.path, fetchInfo.queryParams), {
        method: fetchInfo.method || HttpMethod.GET,
        headers: fetchInfo.headers,
        ...mode,
        ...body,
      });
  }

  /**
   * Execute the fetch request.
   * @param fetchInfo info
   * @returns If request is successful and status code is [200,300),
   * returns NetworkResponse containing statusCode and response payload
   * @throws If request is not successful or statusCode is >=300,
   * throws NetworkError containing statusCode and error payload
   */
  async fetch<T = any>(fetchInfo: FetchInfo = {}): Promise<NetworkResponse<T>> {
    const token = fetchInfo.token || this.token;
    const authHeader = token
      ? {Authorization: `${token}`}
      : {};
    try {
      const response = await this.fetchRaw({
        ...fetchInfo,
        body: JSON.stringify(fetchInfo.body),
        path: urlJoin(APIROOTURL, fetchInfo.path),
        headers: {
          ...authHeader,
          "Content-Type": "application/json",
          ...fetchInfo.headers,
        },
      });

      const content = await response.text();
      const parsedContent = content ? JSON.parse(content) : null;

      if (response.ok) {
        return {
          statusCode: response.status,
          response: parsedContent,
        };
      } else {
        throw {
          statusCode: response.status,
          info: parsedContent,
          isNetworkError: false,
          isServerError: true,
        } as NetworkError;
      }

    } catch (e) {
      if (e.isServerError) {
        throw e;
      }
      throw {
        statusCode: NETWORK_ERROR_CODE,
        info: e,
        isNetworkError: true,
        isServerError: false
      } as NetworkError;
    }

  }
}
