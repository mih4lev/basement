import { middleCategories } from "../../partials/micro-blocks/middle-categories/middle-categories";
import { filters, orderButton } from "../../partials/micro-blocks/filters/filters";
import { filterEvents, loader, requestData } from "../../../source/scripts/utils";
import { ideasData } from "./ideas";

requestData();
middleCategories();
filters();
filterEvents(ideasData);
loader(ideasData);
orderButton();