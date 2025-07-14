import { Injectable } from '@angular/core';
import { formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable({
    providedIn: 'root'
})
export class JCalendarService {

    nameDaysAb: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    nameDays: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    nameMontsAb: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    nameMonts: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


    /**
     * Get month from date
     * @param date The date to extract the month from, can be a Date object or a string in 'YYYY-MM-DD' format.
     * @returns The name of the month in Spanish.
     */
    getMonthFromDate(date: Date | string): string {
        const parsedDate = typeof date === 'string' ? new Date(date) : date;
        const monthIndex = parsedDate.getMonth();
        return this.nameMonts[monthIndex];
    }


    /**
     * Calculate the age of a person based on their birth date.
     * @param birth The birth date as a Date object or a string in 'YYYY-MM-DD' format.
     * @returns The age in years, or null if the birth date is invalid.
     */
    calculateAge(birth: Date | string): number | null {
        if (!birth) {
            return null;
        }
        const birthDate = typeof birth === 'string' ? new Date(birth) : birth;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }


    /**
     * Calculate the complete age of a person based on their birth date.
     * @param birth The birth date as a Date object or a string in 'YYYY-MM-DD' format.
     * @returns An object containing years, months, and days of age.
     */
    calculateAgeComplete(birth: Date | string): { years: number, months: number, days: number } {
        const birthDate = typeof birth === 'string' ? new Date(birth) : birth;
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += previousMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months, days };
    }


    /**
     * Format a date string to a more readable format.
     * @param date The date string in 'YYYY-MM-DD' format.
     * @param month Optional parameter to add to the month name.
     * @returns A formatted date string in the format 'DD de MMMM del YYYY'.
     */
    formatearFechaString(date: string, month?: number) {
        const partesFecha = date.split('-');

        const año = partesFecha[0];
        const mes = this.nameMonts[parseInt(partesFecha[1], 10) - 1];
        const día = parseInt(partesFecha[2], 10);

        let mes_fin;
        if (month) {
            mes_fin = mes + month;
        } else {
            mes_fin = mes;
        }

        return `${día} de ${mes_fin} del ${año}`;
    }


    /**
     * Format a Date object to a string in the format 'DD de MMMM del YYYY'.
     * @param date The Date object to format.
     * @param month Optional parameter to add to the month name.
     * @returns A formatted date string.
     */
    formatearFechaDate(date: Date, month?: number) {
        
        const utc_date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        let new_date = utc_date;

        if (month !== undefined) {
            new_date = new Date(new_date.setUTCMonth(new_date.getUTCMonth() + month));
        }

        // Get the values of the new date in UTC to avoid local time zones
        const año = new_date.getUTCFullYear();
        const mes = this.nameMonts[new_date.getUTCMonth()];
        const día = new_date.getUTCDate();

        return `${día} de ${mes} del ${año}`;
    }


    /**
     * Parse a date string in the format "dd de MMMM del yyyy" to "yyyy-MM-dd".
     * @param fechaStr The date string to parse.
     * @returns The parsed date string in "yyyy-MM-dd" format or null if invalid.
     */
    parseFechaString(fechaStr: string): string | null {
        if (!fechaStr) return null;

        // Map Spanish month names to their numeric equivalents
        const meses: any = {
            'ENERO': '01',
            'FEBRERO': '02',
            'MARZO': '03',
            'ABRIL': '04',
            'MAYO': '05',
            'JUNIO': '06',
            'JULIO': '07',
            'AGOSTO': '08',
            'SEPTIEMBRE': '09',
            'OCTUBRE': '10',
            'NOVIEMBRE': '11',
            'DICIEMBRE': '12'
        };

        const regex = /^(\d{1,2}) de (\w+) del (\d{4})$/i;
        const match = fechaStr.trim().match(regex);

        if (match) {
            const day = match[1].padStart(2, '0');
            const mesStr = match[2].toUpperCase();
            const month = meses[mesStr] || '01';
            const year = match[3];
            return `${year}-${month}-${day}`;
        }

        return null;
    }


    /**
     * Format a date to "MMM YY" format.
     * @param date The date to format, can be a Date object.
     * @returns The formatted date string.
     */
    formatMonthYear(date: Date): string {
        const months = this.nameMontsAb.map(month => month.toUpperCase());
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString().slice(-2);
        return `${month} ${year}`;
    }


    /**
     * Format a date to the Bogotá timezone (UTC-5).
     * @param date The date to format, can be a Date object.
     * @returns The formatted date string in 'yyyy-MM-ddTHH:mm:ss' format.
     */
    formatDateToBogota(date: Date): string {
        const bogotaOffset = -5 * 60;
        const localTime = date.getTime();
        const localOffset = date.getTimezoneOffset() * 60000;
        const utc = localTime + localOffset;
        const bogotaTime = utc + (bogotaOffset * 60000);
        const bogotaDate = new Date(bogotaTime);

        // Format the date to 'yyyy-MM-ddTHH:mm:ss'
        const year = bogotaDate.getFullYear();
        const month = String(bogotaDate.getMonth() + 1).padStart(2, '0');
        const day = String(bogotaDate.getDate()).padStart(2, '0');
        const hours = String(bogotaDate.getHours()).padStart(2, '0');
        const minutes = String(bogotaDate.getMinutes()).padStart(2, '0');
        const seconds = String(bogotaDate.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }


    /**
     * Format a date to a relative time string.
     * This method uses date-fns to format the date relative to now.
     * @param date The date to format, can be a string in 'YYYY-MM-DD' format.
     * @returns A formatted relative time string.
     * @example "hace 2 días", "hace 1 hora", etc
     */
    formatRelativeDate(date: string): string {
        return formatDistanceToNowStrict(new Date(date), {
            locale: {
                ...es,
                formatDistance: (token, count, options) => {
                    const formatDistanceLocale = {
                        lessThanXSeconds: 'hace menos de {{count}} segundos',
                        xSeconds: 'hace {{count}} segundos',
                        halfAMinute: 'hace medio minuto',
                        lessThanXMinutes: 'hace menos de {{count}} minutos',
                        xMinutes: 'hace {{count}} minutos',
                        aboutXHours: 'hace aproximadamente {{count}} horas',
                        xHours: 'hace {{count}} horas',
                        xDays: 'hace {{count}} días',
                        aboutXWeeks: 'hace aproximadamente {{count}} semanas',
                        xWeeks: 'hace {{count}} semanas',
                        aboutXMonths: 'hace aproximadamente {{count}} meses',
                        xMonths: 'hace {{count}} meses',
                        aboutXYears: 'hace aproximadamente {{count}} años',
                        xYears: 'hace {{count}} años',
                        overXYears: 'hace más de {{count}} años',
                        almostXYears: 'hace casi {{count}} años'
                    };

                    let result = formatDistanceLocale[token];

                    if (typeof count === 'number') {
                        result = result.replace('{{count}}', count.toString());

                        // Singulars and plurals
                        if (token === 'xHours' && count === 1) {
                            result = result.replace('horas', 'hora');
                        }
                        if (token === 'xDays' && count === 1) {
                            result = result.replace('días', 'día');
                        }
                        if (token === 'xWeeks' && count === 1) {
                            result = result.replace('semanas', 'semana');
                        }
                        if (token === 'xMonths' && count === 1) {
                            result = result.replace('meses', 'mes');
                        }
                        if (token === 'xYears' && count === 1) {
                            result = result.replace('años', 'año');
                        }
                    }

                    return result;
                }
            }
        });
    }

}
