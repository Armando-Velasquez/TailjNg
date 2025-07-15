interface BaseAlertDialogProps {
    title: string;
    description: string;
}


interface SuccessAlertDialogProps extends BaseAlertDialogProps {
    type: "success";
    onConfirm: () => Promise<void> | void;
    titleBtnConfirm?: string;
}


interface InfoAlertDialogProps extends BaseAlertDialogProps {
    type: "info";
    onConfirm: () => Promise<void> | void;
    onCancel?: () => Promise<void> | void;
    titleBtnConfirm?: string;
    titleBtnCancel?: string;
}


interface WarningAlertDialogProps extends BaseAlertDialogProps {
    type: "warning";
    onConfirm: () => Promise<void> | void;
    onCancel?: () => Promise<void> | void;
    titleBtnConfirm?: string;
    titleBtnCancel?: string;
}


interface QuestionAlertDialogProps extends BaseAlertDialogProps {
    type: "question";
    onConfirm: () => Promise<void> | void;
    onCancel: () => Promise<void> | void;
    titleBtnConfirm?: string;
    titleBtnCancel?: string;
}


interface ErrorAlertDialogProps extends BaseAlertDialogProps {
    type: "error";
    onConfirm: () => Promise<void> | void;
    onCancel?: () => Promise<void> | void;
    onRetry?: () => Promise<void> | void;
    titleBtnConfirm?: string;
    titleBtnCancel?: string;
    titleBtnRetry?: string;
}


interface LoadingAlertDialogProps extends BaseAlertDialogProps {
    type: "loading";
    onCancel: () => Promise<void> | void;
    titleBtnCancel?: string;
}


export type AlertDialogProps =
    | SuccessAlertDialogProps
    | InfoAlertDialogProps
    | WarningAlertDialogProps
    | QuestionAlertDialogProps
    | ErrorAlertDialogProps
    | LoadingAlertDialogProps;


export interface Dialog {
    config: AlertDialogProps;
    isConfirmLoading: boolean;
    isCancelLoading: boolean;
    isRetryLoading: boolean;
}