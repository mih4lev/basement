import { loader, requestData } from "../../../../source/scripts/utils";
import { pressData } from "./press";

requestData(`/api/press/all`);
loader(pressData);