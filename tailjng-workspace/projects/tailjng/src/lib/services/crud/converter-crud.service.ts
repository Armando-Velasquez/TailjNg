import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { JCalendarService } from '../transformer/calendar.service';
import { TableColumn } from '../../interfaces/crud/crud.interface';

@Injectable({
    providedIn: 'root'
})
export class JConverterCrudService {

    constructor(
        private readonly currencyPipe: CurrencyPipe,
        private readonly calendarService: JCalendarService,
    ) { }

    /**
     * Get the correct sort key from the sortColumn object or string.
     * @param sortColumn The column to sort by, can be a string or an object with a 'col' property.
     * @returns The sort key as a string.
     */
    getSortKey(sortColumn: any): string {
        if (typeof sortColumn === 'object' && sortColumn !== null) {
            return sortColumn.col;
        }

        return sortColumn;
    }


    /**
     * Converter object to an array of objects with key and value for form initialization.
     * @param formGroup The FormGroup to convert.
     * @returns An array of objects with key and value for form initialization.
     */
    initializeFormControls(formGroup: FormGroup): { [key: string]: AbstractControl | null } {
        const formControls: { [key: string]: AbstractControl | null } = {};

        Object.keys(formGroup.controls).forEach(key => {
            formControls[`${key}_control`] = formGroup.get(key);
        });

        return formControls;
    }


    /**
     * Formats data based on the column type.
     * @param value The value to format.
     * @param column The column definition.
     * @return Formatted value based on the column type
     */
    formatData(value: any, column: TableColumn<any>): any {

        if (column.isdollar && value !== null) {
            const transformedValue = this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-2');
            return transformedValue ? transformedValue.replace('US', '') : null;
        }

        if (column.isCurrency && value !== null) {
            return this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-2');
        }

        if (column.isDate && value !== null) {
            return new Date(value).toLocaleDateString();
        }

        if (column.isDateText && value !== null) {
            return this.calendarService.formatearFechaString(`${value}`);
        }

        if (column.isDateTime && value !== null) {
            return new Date(value).toLocaleString();
        }

        if (column.isDateTimeText && value !== null) {
            return new Date(value).toString();
        }

        if (column.isRelativeTime && value !== null) {
            return this.calendarService.formatRelativeDate(value);
        }

        if (column.isFirstWord && value !== null) {
            return value.split(' ')[0];
        }

        return value;
    }


    /**
     * This method converts values to appropriate types based on the column definition.
     * It handles various formats such as currency, date, and text.
     * @param value The value to parse.
     * @param column The column definition.
     * @returns The parsed value or null if invalid.
     */
    parseData(value: any, column: TableColumn<any>): any {
        if (value === null || value === undefined || value === 'S/N') {
            return null;
        }

        let cleaned = value;

        // If it's text, trim whitespace
        if (typeof cleaned === 'string') {
            cleaned = cleaned.trim();
        }

        // isdollar → remove symbol and parse to number
        if (column.isdollar && typeof cleaned === 'string') {
            cleaned = cleaned.replace(/[^\d,.-]/g, '').replace(',', '.');
            return cleaned ? parseFloat(cleaned) : null;
        }

        // isCurrency → remove symbol and parse to number
        if (column.isCurrency && typeof cleaned === 'string') {
            cleaned = cleaned.replace(/[^\d,.-]/g, '').replace(',', '.');
            return cleaned ? parseFloat(cleaned) : null;
        }

        // isDateText → parse text from date to ISO format (yyyy-MM-dd)
        if (column.isDateText && typeof cleaned === 'string') {
            // Use your reverse calendarService if you have one
            const fecha = this.calendarService.parseFechaString(cleaned);
            return fecha ?? cleaned;
        }

        // isDate → parse text to Date or ISO string
        if (column.isDate && typeof cleaned === 'string') {
            const fecha = new Date(cleaned);
            return isNaN(fecha.getTime()) ? cleaned : fecha.toISOString().substring(0, 10);
        }

        // isDateTime → parse text to DateTime
        if (column.isDateTime && typeof cleaned === 'string') {
            const fecha = new Date(cleaned);
            return isNaN(fecha.getTime()) ? cleaned : fecha.toISOString();
        }

        // isDateTimeText → parse text to DateTime
        if (column.isDateTimeText && typeof cleaned === 'string') {
            const fecha = new Date(cleaned);
            return isNaN(fecha.getTime()) ? cleaned : fecha.toISOString();
        }

        // isRelativeTime → impossible to reverse automatically, return text
        if (column.isRelativeTime) {
            return cleaned;
        }

        // isFirstWord → return full text, as it's unclear which part to remove
        if (column.isFirstWord) {
            return cleaned;
        }

        return cleaned;
    }
}