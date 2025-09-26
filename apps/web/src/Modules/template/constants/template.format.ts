export type creationSteps =
    | 'setup_template'
    | 'edit_template'
    | 'submit_review';

export interface HeaderNavigationButton {
    name: string;
    key: creationSteps;
    icon: React.ReactNode;
}
