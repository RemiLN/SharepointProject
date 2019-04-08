
import IUVData from "../models/UV";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IUvFormProps {
  description: string;
  context: WebPartContext;
  selectedValue?: number;
}
