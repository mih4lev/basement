import { filters } from "../../../partials/micro-blocks/filters/filters";
import { filterEvents, loader, requestData } from "../../../../source/scripts/utils";
import { blogData } from "./blog";

requestData(`/api/tips/all`);
filters();
filterEvents(blogData);
loader(blogData);

