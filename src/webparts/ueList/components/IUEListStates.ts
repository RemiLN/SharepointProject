import IUEData from "../models/UE";
import IUVData from "../models/UV";

export interface IUeListState {
    Isloading: boolean;
    IsError: boolean;
    IsSaved: boolean;
    Error: any;
    selectedUe: IUEData;
    selectedId?:number;
    uvList: any;
    ueList:any;
}