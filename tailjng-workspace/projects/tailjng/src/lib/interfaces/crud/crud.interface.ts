
// ======================================================
// Table Column Interface
// This interface defines the structure of a table column in a CRUD application.
// ======================================================

type KeyPath<T> = T extends object
    ? {
        [K in keyof T]: K extends string | number
        ? `${K}` | `${K}.${KeyPath<T[K]>}`
        : never;
    }[keyof T]
    : never;

type ExtraColumnKeys = 'total' | 'expand' | 'extra';
type ExtendedKeyPath<T> = KeyPath<T> | ExtraColumnKeys;

export interface TableColumn<T> {
    key: ExtendedKeyPath<T>;
    label: string; 
    visible?: boolean;
    sortable?: boolean;
    isSearchable?: boolean;
    isDisabled?: boolean;
    isDecorator?: boolean;
    colorDecorator?: (row: T) => 'primary' | 'success' | 'error' | 'warning' | 'info' | undefined;
    isDecoratorArray?: boolean;
    isCurrency?: boolean;
    isdollar?: boolean;
    isDate?: boolean;
    isDateText?: boolean;
    isDateTime?: boolean;
    isRelativeTime?: boolean;
    isDecoratorDateTime?: boolean;
    isDateTimeText?: boolean;
    isFirstWord?: boolean;
    isLink?: boolean;
    styles?: { [key: string]: string };
    valueGetter?: (row: T) => any;
    template?: (row: T) => string;
    expandTemplate?: (row: T) => string;
    extraSearchFields?: (keyof T | string)[];
    hidden?: boolean;
}

export type SortDirection = 'none' | 'asc' | 'desc';


export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingStates {
    initialLoad: LoadingState;
    search: LoadingState;
    itemsPerPage: LoadingState;
    pagination: LoadingState;
    sort: LoadingState;
    checked: LoadingState;
    action: LoadingState;
    aditionalButtons: { [buttonType: string]: LoadingState };
}

type DefaultTypeOptionTable = 'edit' | 'delete' | 'disabled' | 'custom' | 'editRow';

type CommonOptionTableProps = {
    type?: `${DefaultTypeOptionTable}` | (string & {});
    icon?: ((data?: any) => any) | any;
    clicked?: (data: any) => void;
    text?: ((data?: any) => string) | string;
    tooltip?: ((data?: any) => string) | string;
    disabled?: ((data?: any) => boolean) | boolean;
    isVisible?: ((data?: any) => boolean) | boolean;
    tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
    ngClass?: ((data?: any) => any) | any;
    classes?: string;
    searchListUpload?: {
        [endpoint: string]: {
            keyReturn: string,
            keyColumnSearch: string,
            keyAlternate?: string,
            optional?: boolean;
            defaultFilters?: { [key: string]: string | number | (string | number)[] | undefined };
        };
    };
};


// ===================================================

type OptionTableWithChangeIcon = CommonOptionTableProps & {
    isChangeIcon: boolean | (() => boolean);
    iconChange: any;
};

type OptionTableWithoutChangeIcon = CommonOptionTableProps & {
    isChangeIcon?: undefined;
    iconChange?: any;
};

export type OptionsTable = OptionTableWithChangeIcon | OptionTableWithoutChangeIcon;


// ===================================================

export interface QueryParams {
    page?: number;
    limit?: number;

    sort?: { column?: string | null; direction?: string };

    filters?: any;
    defaultFilters?: { [key: string]: any };

    searchQuery?: string;
    columns?: string[]
}

export interface EnableBoolean<T> {
    key: keyof T;
    value: any;
    values: any[];
    keyDate?: keyof T;
    isDateNullable?: boolean;
}