import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class JParamsHttpService {

    /**
     * Transform Params to HttpParams
     * @param params 
     * @returns 
     */
    resParams(params: Params): HttpParams {

        // Construct HttpParams
        let httpParams = new HttpParams();

        if (params) {
            Object.keys(params).forEach(key => {
                const value = params[key];

                // If the value is an object (e.g., filter: { id_status: [1, 2] })
                if (typeof value === 'object' && value !== null) {
                    Object.keys(value).forEach(subKey => {
                        const subValue = value[subKey];

                        // If the subValue is an array (e.g., id_status: [1, 2])
                        if (Array.isArray(subValue)) {
                            subValue.forEach(v => {
                                httpParams = httpParams.append(`${key}[${subKey}]`, v);
                            });
                        } else {
                            // If it's a unique value
                            httpParams = httpParams.append(`${key}[${subKey}]`, subValue);
                        }
                    });
                } else {
                    // If it's a flat value (e.g., id_status: 1)
                    httpParams = httpParams.append(key, value);
                }
            });
        }
        return httpParams;
    }

}