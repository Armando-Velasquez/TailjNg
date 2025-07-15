interface BaseAlertToastProps {
    title: string;
    description: string;
    autoClose?: boolean;
    autoCloseDelay?: number;
    actionButtonText?: string;
}


interface SuccessAlertToastProps extends BaseAlertToastProps {
    type: "success";
    onAction?: () => Promise<void> | void;
}


interface InfoAlertToastProps extends BaseAlertToastProps {
    type: "info";
    onAction?: () => Promise<void> | void;
    onCancel?: () => Promise<void> | void;
    titleBtnCancel?: string;
}


interface WarningAlertToastProps extends BaseAlertToastProps {
    type: "warning";
    onAction?: () => Promise<void> | void;
    onCancel?: () => Promise<void> | void;
    titleBtnCancel?: string;
}


interface QuestionAlertToastProps extends BaseAlertToastProps {
    type: "question";
    onAction: () => Promise<void> | void;
    onCancel: () => Promise<void> | void;
    titleBtnCancel?: string;
}


interface ErrorAlertToastProps extends BaseAlertToastProps {
    type: "error";
    onAction?: () => Promise<void> | void;
    onCancel?: () => Promise<void> | void;
    titleBtnCancel?: string;
}


interface LoadingAlertToastProps extends BaseAlertToastProps {
    type: "loading";
    onCancel: () => Promise<void> | void;
    titleBtnCancel?: string;
}


export type AlertToastProps =
    | SuccessAlertToastProps
    | InfoAlertToastProps
    | WarningAlertToastProps
    | QuestionAlertToastProps
    | ErrorAlertToastProps
    | LoadingAlertToastProps;


export interface Toast {
    id: string;
    config: AlertToastProps;
    isActionLoading: boolean;
    isCancelLoading: boolean;
    onActionCallback?: () => Promise<void> | void;
    onCancelCallback?: () => Promise<void> | void;
    actionNameButton: string;
    createdAt: number;
}
