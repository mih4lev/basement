import { loader, requestData } from "../../../../source/scripts/utils";
import { testimonialsData } from "./testimonials";

requestData(`/api/testimonials/all`);
loader(testimonialsData);