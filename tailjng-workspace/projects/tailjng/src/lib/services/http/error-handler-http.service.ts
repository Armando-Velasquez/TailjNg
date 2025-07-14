import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerHttpService {

    /**
     * Map HTTP status codes to user-friendly messages and alert types.
     * This mapping helps in providing consistent error messages across the application.
     */
    private readonly errorMappings: { [key: number]: { title: string, message: string, type: 'error' | 'info', persistent: boolean } } = {
        400: { type: 'info', title: 'Solicitud incorrecta', message: 'Los datos enviados no son válidos. Verifique e intente de nuevo.', persistent: false },
        401: { type: 'info', title: 'No autorizado', message: 'Debe iniciar sesión para acceder a esta función.', persistent: true },
        403: { type: 'error', title: 'Acceso denegado', message: 'No tiene permisos para realizar esta acción.', persistent: true },
        404: { type: 'info', title: 'No encontrado', message: 'El recurso solicitado no existe o fue eliminado.', persistent: false },
        409: { type: 'info', title: 'Conflicto', message: 'Conflicto en la solicitud. Verifique los datos ingresados.', persistent: false },
        422: { type: 'info', title: 'Datos no procesables', message: 'Los datos son válidos, pero no pueden ser procesados en este momento.', persistent: false },
        429: { type: 'info', title: 'Demasiadas solicitudes', message: 'Ha realizado demasiadas solicitudes. Intente más tarde.', persistent: true },
        500: { type: 'error', title: 'Error del servidor', message: 'Ocurrió un error inesperado. Intente más tarde.', persistent: true },
        503: { type: 'error', title: 'Servicio no disponible', message: 'El servidor está en mantenimiento o sobrecargado.', persistent: true }
    };


    /**
     * Handle HTTP errors and return a structured message with alert type.
     * @param error The error object returned from the HTTP request.
     * @returns A structured error message.
     */
    handleHttpError(error: any) {
        console.error('HTTP Error:', error);

        // If no error is defined, return a generic message
        if (!error) {
            return {
                type: 'error',
                title: 'Error desconocido',
                message: 'Ocurrió un error inesperado. Intente de nuevo más tarde.',
                persistent: true
            };
        }

        const status = error?.status || 0;
        const backendMessage = error?.error?.msg || error?.message;

        const errorInfo = this.errorMappings[status] || {
            title: 'Error desconocido',
            message: 'Ocurrió un error inesperado. Intente de nuevo más tarde.',
            type: 'error',
            persistent: true
        };

        return {
            type: errorInfo.type,
            title: errorInfo.title,
            message: backendMessage || errorInfo.message,
            persistent: errorInfo.persistent
        };
    }

}