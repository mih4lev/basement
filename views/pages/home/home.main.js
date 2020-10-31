import { testimonialsCarousel, youtubeVideo } from "../../partials/blocks/testimonials/testimonials";
import { middleCategories } from "../../partials/micro-blocks/middle-categories/middle-categories";
import { offersIcons } from "../../partials/micro-blocks/offers-buttons/offers-buttons";
import Swiper from 'swiper/bundle';

testimonialsCarousel();
youtubeVideo();
middleCategories();
offersIcons();

new Swiper(`.swiper-container`, {
    direction: `vertical`,
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    }
});