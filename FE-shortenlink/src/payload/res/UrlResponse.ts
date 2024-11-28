export interface UrlResponse {
    data: any;
    message : string;
    urlUUID : string;
    description : string;
    resource : string;
    errors? :Array<{
        field : string;
        errorCode : string;
        message : string;
    }>
}