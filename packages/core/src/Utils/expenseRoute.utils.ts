import {
    AR_DASHBOARD_ROUTE,
    ARC_HOME_ROUTE,
    DASHBOARD_ROUTE,
    EMPLOYEE_EXPENSE_DASHBOARD_ROUTE,
    EXPENSE_DASHBOARD_ROUTE,
    FINOPS_EXPENSE_DASHBOARD_ROUTE,
    HOME_ROUTE,
    PAYMENT_HOME_ROUTE,
    PRODUCT_IDENTIFIER,
    VENDOR_EXPENSE_DASHBOARD_ROUTE,
} from '../Constants';
import { Navigation } from './navigation.utils';

export class ExpenseRouteUtils {
    private static isExpense = false;

    public static CheckExpenseRoute(pathname: string = '') {
        this.isExpense = pathname.startsWith(EXPENSE_DASHBOARD_ROUTE);
        return this.isExpense;
    }

    public static CheckARRoute(pathname: string = '') {
        return pathname.startsWith(AR_DASHBOARD_ROUTE);
    }

    public static CheckVendorExpenseRoute(pathname: string = '') {
        this.isExpense = pathname.startsWith(VENDOR_EXPENSE_DASHBOARD_ROUTE);
        return this.isExpense;
    }

    public static CheckEmployeeExpenseRoute(pathname: string = '') {
        this.isExpense = pathname.startsWith(EMPLOYEE_EXPENSE_DASHBOARD_ROUTE);
        return this.isExpense;
    }

    public static CheckFinopsExpenseRoute(pathname: string = '') {
        this.isExpense = pathname.startsWith(FINOPS_EXPENSE_DASHBOARD_ROUTE);
        return this.isExpense;
    }
    public static CheckARCRoute(pathname: string = '') {
        return pathname.startsWith(ARC_HOME_ROUTE);
    }
    public static CheckPaymentRoute(pathname: string = '') {
        return pathname.startsWith(PAYMENT_HOME_ROUTE);
    }

    public static GetPortalType(pathname: string = '') {
        return '/';
        // if (this.CheckVendorExpenseRoute(pathname)) {
        //     return 'vendor';
        // }
        // if (this.CheckEmployeeExpenseRoute(pathname)) {
        //     return 'employee';
        // }
        // if (this.CheckFinopsExpenseRoute(pathname)) {
        //     return 'finops';
        // }
        // if (this.CheckARCRoute(pathname)) {
        //     return 'arc';
        // }
        // if (this.CheckPaymentRoute(pathname)) {
        //     return 'payment';
        // }
        // if (this.CheckARRoute(pathname)) {
        //     return 'reco';
        // }
        return null;
    }

    public static GetPortalTypeId(pathname: string = '') {
        return PRODUCT_IDENTIFIER[this.GetPortalType(pathname)?.toUpperCase()];
    }

    public static IsExpense() {
        return ExpenseRouteUtils.isExpense;
    }

    public static GetFrontendPath = (product_id: number) => {
        return HOME_ROUTE;
        if (product_id === PRODUCT_IDENTIFIER.VENDOR) {
            return VENDOR_EXPENSE_DASHBOARD_ROUTE;
        }
        if (product_id === PRODUCT_IDENTIFIER.EMPLOYEE) {
            return EMPLOYEE_EXPENSE_DASHBOARD_ROUTE;
        }
        if (product_id === PRODUCT_IDENTIFIER.FINOPS) {
            return FINOPS_EXPENSE_DASHBOARD_ROUTE;
        }
        if (product_id === PRODUCT_IDENTIFIER.ARC) {
            return ARC_HOME_ROUTE;
        }
        if (product_id === PRODUCT_IDENTIFIER.PAYMENT) {
            return PAYMENT_HOME_ROUTE;
        }
        if (product_id === PRODUCT_IDENTIFIER.RECO) {
            return HOME_ROUTE;
        }
        return HOME_ROUTE;
    };

    public static fixPortalPath = (product_id: number, pathname: string) => {
        const frontendPath = this.GetFrontendPath(product_id);
        const pathnamePortalId = this.GetPortalTypeId(pathname);

        if (pathnamePortalId === product_id) return;

        Navigation.navigate({
            url: frontendPath,
        });
    };

    public static GetPathWithoutPortalRoute = (path: string) => {
        let cleanPath = path;

        if (cleanPath.startsWith('/' + DASHBOARD_ROUTE)) {
            cleanPath = cleanPath.replace('/' + DASHBOARD_ROUTE, '');
        }
        if (ExpenseRouteUtils.CheckExpenseRoute(path)) {
            cleanPath = cleanPath.replace(VENDOR_EXPENSE_DASHBOARD_ROUTE, '');
            cleanPath = cleanPath.replace(EMPLOYEE_EXPENSE_DASHBOARD_ROUTE, '');
            cleanPath = cleanPath.replace(FINOPS_EXPENSE_DASHBOARD_ROUTE, '');
        }
        if (ExpenseRouteUtils.CheckARCRoute(path)) {
            cleanPath = cleanPath.replace(ARC_HOME_ROUTE, '');
        }
        if (ExpenseRouteUtils.CheckPaymentRoute(path)) {
            cleanPath = cleanPath.replace(PAYMENT_HOME_ROUTE, '');
        }

        return cleanPath;
    };
}
