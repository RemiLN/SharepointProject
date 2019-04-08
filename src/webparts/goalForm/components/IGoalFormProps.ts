
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IGoalFormProps {
  description: string;
  context: WebPartContext;
  selectedValue?: number;
}
