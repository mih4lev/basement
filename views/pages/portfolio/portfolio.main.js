import { filters } from "../../partials/micro-blocks/filters/filters";
import { workImages } from "./work/work";
import { portfolioData } from "./portfolio";
import { filterEvents, loader, requestData } from "../../../source/scripts/utils";

requestData(`/api/portfolio/all`);
workImages();
filters();
filterEvents(portfolioData);
loader(portfolioData);