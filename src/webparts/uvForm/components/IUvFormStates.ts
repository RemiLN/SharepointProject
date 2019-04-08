
import IUVData from "../models/UV";

export interface IUvFormState {
    Isloading: boolean;
    IsError: boolean;
    IsSaved: boolean;
    Error: any;
    selectedUv: IUVData;
    selectedId?:number;
    uvList: any;
}