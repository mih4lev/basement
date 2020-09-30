import { webpCheck } from "../../source/scripts/utils";
import { headerMenu } from "../partials/header/header";
import { viewIdeaModal } from "../partials/modals/view-idea/view-idea.modal";
import { saveIdeaModal } from "../partials/modals/save-idea/save-idea.modal";
import { signInModal } from "../partials/modals/sign-in/sign-in.modal";
import { contactUsModal } from "../partials/modals/contact-us/contact-us.modal";
import { zipCodeButtons } from "../partials/micro-blocks/zip-code/zip-code";
import { selectElements, sendForms } from "../partials/forms/forms";
import { googleAuth } from "../../source/scripts/google.auth";
import { facebookAuth } from "../../source/scripts/facebook.auth";
import { bookingTool } from "../partials/modals/booking-tool/booking.modal";

// webp checker
webpCheck();

// header menu
headerMenu();

// ideas modal show
viewIdeaModal();
saveIdeaModal();

// login button modal show
signInModal();
googleAuth();
facebookAuth();

// add contact us modal show
contactUsModal();

// contact us form
selectElements();
sendForms();

// schedule buttons
zipCodeButtons();

// booking-tool
bookingTool();