import { Inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { map, Observable } from 'rxjs';
import { TAILJNG_CONFIG } from '../../config/tailjng-config.token';
import { TailjngConfig } from '../../interfaces/config.interface';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../interfaces/crud/api-response';
import { EnableBoolean, QueryParams } from '../../interfaces/crud/crud.interface';
import { JParamsHttpService } from '../http/params-http.service';
import { JConverterCrudService } from './converter-crud.service';

@Injectable({
    providedIn: 'root'
})
export class JGenericCrudService {

    constructor(
        @Inject(TAILJNG_CONFIG) private readonly config: TailjngConfig,
        private readonly http: HttpClient,
        private readonly paramsHttpService: JParamsHttpService,
        private readonly converterCrudService: JConverterCrudService,
    ) { }

    /**
     * Method to get all records from an endpoint.
     * @param endpoint Distinctive of the endpoint ('role', 'status', etc.)
     * @param params Parameters of the request.
     * @returns Observable with the API response.
     */
    getAll<T>(endpoint: string, params?: Params): Observable<ApiResponse<T>> {
        const url = `${this.config.urlBase}/${endpoint}`;
        let httpParams;
        if (params) httpParams = this.paramsHttpService.resParams(params);
        return this.http.get<ApiResponse<T>>(url, { params: httpParams });
    }


    /**
     * Method to get a record from an endpoint.
     * @param endpoint Distinctive of the endpoint ('role', 'status', etc.)
     * @param id Identifier of the record.
     * @returns Observable with the API response.
     */
    getId<T>(endpoint: string, id: number): Observable<T> {
        const url = `${this.config.urlBase}/${endpoint}`;
        return this.http.get<ApiResponse<{ [key: string]: T }>>(`${url}/${id}`).pipe(
            map(response => response.data[endpoint])
        );
    }


    /**
     * Method to create a record in an endpoint.
     * @param endpoint Distinctive of the endpoint ('role', 'status', etc.)
     * @param data Data of the record to add.
     * @returns Observable with the API response.
     */
    create<T>(endpoint: string, data: T): Observable<ApiResponse<T>> {
        const url = `${this.config.urlBase}/${endpoint}`;
        return this.http.post<ApiResponse<T>>(url, data);
    }


    /**
     * MMethod to update a record in an endpoint.
     * @param endpoint Distinctive of the endpoint ('role', 'status', etc.)
     * @param id Identifier of the record.
     * @param data Data of the record to update.
     * @returns Observable with the API response.
     */
    update<T>(endpoint: string, id: number, data: T): Observable<ApiResponse<T>> {
        const url = `${this.config.urlBase}/${endpoint}`;
        return this.http.put<ApiResponse<T>>(`${url}/${id}`, data);
    }


    /**
     * MMethod to delete a record from an endpoint.
     * @param endpoint Distinctive of the endpoint ('role', 'status', etc.)
     * @param id Identifier of the record.
     * @returns Observable with the API response.
     */
    delete<T>(endpoint: string, id: number): Observable<ApiResponse<T>> {
        const url = `${this.config.urlBase}/${endpoint}`;
        return this.http.delete<ApiResponse<T>>(`${url}/${id}`);
    }


    /**
    * Method to update the status of a record in an endpoint.
    * @param endpoint Distinctive of the endpoint ('role', 'status', etc.)
    * @param id Identifier of the record.
    * @param data Data of a boolean record to update.
    * @returns Observable with the API response.
    */
    enable<T>(endpoint: string, id: number, data: EnableBoolean<T>): Observable<ApiResponse<T>> {
        const url = `${this.config.urlBase}/${endpoint}`;
        return this.http.put<ApiResponse<T>>(`${url}/enable/${id}`, data);
    }


    /**
     * MMethod to create multiple records in an endpoint.
     * @param endpoint Distinctive of the endpoint ('role', 'status', etc.)
     * @param data Data of multiple records to add.
     * @returns Observable with the API response.
     */
    createMultiple<T>(endpoint: string, data: T[]): Observable<ApiResponse<T[]>> {
        const url = `${this.config.urlBase}/${endpoint}/bulk`;
        return this.http.post<ApiResponse<T[]>>(url, data);
    }


    /**
    * Method to get the query parameters for a table.
    * @param page Current page number.
    * @param limit NNumber of records per page.
    * @param sort Object containing the column and the sorting direction.
    * @param filters Filters applied to the query.
    * @param defaultFilters Default filters applied to the query.
    * @param searchQuery Search string.
    * @param columns Columns to search.
    * @returns
    */
    params({ page, limit, sort, filters, defaultFilters, searchQuery, columns }: QueryParams): Params {

        const params: Params = {}

        if (page) params['page'] = page.toString();
        if (limit) params['limit'] = limit.toString();

        // Apply default filters if provided
        Object.keys(defaultFilters ?? {}).forEach((key) => {
            if (!filters.hasOwnProperty(key)) {
                params[`filter[${key}]`] = defaultFilters![key];
            }
        });

        // If sort is provided, get the sort key and direction
        if (sort?.column && sort?.direction !== 'none') {
            const sortKey = this.converterCrudService.getSortKey(sort?.column);
            params['sortBy'] = sortKey;
            params['sortOrder'] = sort?.direction?.toUpperCase();
        }

        // Apply search if provided
        if (searchQuery && searchQuery.trim() !== '') {
            params['search'] = searchQuery;
            params['searchFields'] = columns?.map(col => col);
        }

        // Apply filters if provided
        if (Object.keys(filters).length > 0) {
            params['filter'] = filters;
        }

        return params;
    }

}
