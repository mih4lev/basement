import { testimonialsCarousel, youtubeVideo } from "../../partials/blocks/testimonials/testimonials";
import Swiper from 'swiper/bundle';

testimonialsCarousel();
youtubeVideo();

new Swiper(`.swiper-container`, {
    direction: `vertical`,
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    }
});