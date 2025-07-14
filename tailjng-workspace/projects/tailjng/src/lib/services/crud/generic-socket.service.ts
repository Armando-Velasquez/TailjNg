// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { SocketShared } from 'src/app/core/shared/socket.shared';
// @Injectable({
//     providedIn: 'root'
// })
// export class JGenericCrudService {

//     constructor(
//         private readonly socketShared: SocketShared,
//     ) { }

//     /**
//      * Listen to the creation event for a specific entity.
//      * @param entity name of the entity (e.g., 'period', 'user')
//      */
//     onCreated<T = any>(entity: string): Observable<T> {
//         return this.socketShared.listenTo<T>(`${entity}:created`);
//     }

//     /**
//      * Listen to the update event for a specific entity.
//      * @param entity name of the entity (e.g., 'period', 'user')
//      */
//     onUpdated<T = any>(entity: string): Observable<T> {
//         return this.socketShared.listenTo<T>(`${entity}:updated`);
//     }

//     /**
//      * Listen to the delete event for a specific entity.
//      * @param entity name of the entity (e.g., 'period', 'user')
//      */
//     onDeleted<T = any>(entity: string): Observable<T> {
//         return this.socketShared.listenTo<T>(`${entity}:deleted`);
//     }

//     /**
//      * Listen to the enable event for a specific entity.
//      * @param entity name of the entity (e.g., 'period', 'user')
//      */
//     onEnabled<T = any>(entity: string): Observable<T> {
//         return this.socketShared.listenTo<T>(`${entity}:enabled`);
//     }

//     /**
//      * Listen to multiple events for a specific entity.
//      * @param entity name of the entity (e.g., 'period')
//      * @param actions list of events to listen for (e.g., ['created', 'updated'])
//      * @param persistent true if you want the listener to persist after the component is destroyed
//      */
//     listenToMany<T = any>(
//         entity: string,
//         actions: Array<'created' | 'updated' | 'deleted' | 'enabled' | string>,
//         persistent: boolean = false
//     ): Observable<{ event: string, data: T }> {
//         return this.socketShared.listenToMany<T>(entity, actions, persistent);
//     }

// }
