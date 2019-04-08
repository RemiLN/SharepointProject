import IUEData from "../models/UE";
import IUVData from "../models/UV";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IUeListProps {
  description: string;
  context: WebPartContext;
  selectedValue?: number;
}
