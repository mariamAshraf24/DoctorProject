export interface IAdmin {
    id: string;
    name: string;
    doctors: any; // Assuming doctors is an array of strings representing doctor IDs or names
}
export interface IAdminResponse {
    data: IAdmin[];
    message: string;
    success: boolean;
    errors: any;
}