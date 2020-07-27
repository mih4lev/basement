import { contactForm, selectElements, titleWidth, webpCheck } from "./utils";
import { headerMenu } from "../../views/partials/header/header";
import { showDeleteWrappers } from "../../views/pages/profile/profile";
import { addPhotoModal } from "../../views/partials/modals/add-photo/add-photo.modal";
import { editProfileModal } from "../../views/partials/modals/edit-profile/edit-profile.modal";
import { editAlbumModal } from "../../views/partials/modals/edit-album/edit-album.modal";
import { createAlbumModal } from "../../views/partials/modals/create-album/create-album.modal";
import { viewIdeaModal } from "../../views/partials/modals/view-idea/view-idea.modal";
import { signInModal } from "../../views/partials/modals/sign-in/sign-in.modal";
import { contactUsModal } from "../../views/partials/modals/contact-us/contact-us.modal";
import { processSteps } from "../../views/pages/how-it-works/process/process";
import { signUpForm } from "../../views/pages/sign-up/sign-up";
import { filters } from "../../views/partials/micro-blocks/filters/filters";
import { reviewsCarousel } from "../../views/partials/blocks/reviews/reviews";
import { middleCategories } from "../../views/partials/micro-blocks/middle-categories/middle-categories";
import { offersIcons } from "../../views/partials/micro-blocks/offers-buttons/offers-buttons";
import { offersForm } from "../../views/pages/about-us/offers/offers";
import { zipCodeButtons } from "../../views/partials/micro-blocks/zip-code/zip-code";

// webp checker
webpCheck();

// header menu
headerMenu();

// how it works => our process | show steps
processSteps();

// ideas modal show
viewIdeaModal();

// login button modal show
signInModal();

// add contact us modal show
contactUsModal();

// contact us form
selectElements();
contactForm();

// filters
filters();

// schedule buttons
zipCodeButtons();

if (location.pathname.includes(`sign-up`)) {
    signUpForm();
}

// need worked only on profile page (made custom loading JS)
if (location.pathname.includes(`profile`)) { // temp
    addPhotoModal();
    showDeleteWrappers();
    editProfileModal();
    createAlbumModal();
    editAlbumModal();
}

if (location.pathname === `/`) {
    reviewsCarousel();
    middleCategories();
    offersIcons();
}

if (location.pathname.includes(`local`)) {
    reviewsCarousel();
}

if (location.pathname.includes(`basement-ideas`)) {
    middleCategories();
}

if (location.pathname.includes(`financing-offers`)) {
    offersIcons();
    offersForm();
}

// temp func for title width
titleWidth();