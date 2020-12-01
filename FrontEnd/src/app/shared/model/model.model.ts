export class TransportRequestInfor {
    refNo: string;
    placeFrom: string;
    placeTo: string;
    excutionDate: Date;
    driverName: string;
    licensePlate: string;
}
export class Surcharge{
    id: number;
    image: File;
    name: string;
    inforSurcharge: InforSurcharge;
    currency: string;
    includeVAT: string;
    VATrate: string;
}
export class ListSurchage{
    id: string;
    chargeName_VN: string;
    chargeName_EN: string;
    shipmentTypeID:string;
    userCreated:string;
    datetimeCreate:string;
    inActive: boolean;
    inActiveOn: Date;
    automaticallyGenerated: boolean;
}
export class InforSurcharge{
    taxCode: string;
    ticketNumber: string;
    price: string;
}