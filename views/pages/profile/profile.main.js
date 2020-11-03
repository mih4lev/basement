import { addPhotoModal } from "../../partials/modals/add-photo/add-photo.modal";
import { showDeleteWrappers, calendarToken, albumsIdeasData } from "./profile";
import { editProfileModal } from "../../partials/modals/edit-profile/edit-profile.modal";
import { createAlbumModal } from "../../partials/modals/create-album/create-album.modal";
import { editAlbumModal } from "../../partials/modals/edit-album/edit-album.modal";
import { loader, requestData } from "../../../source/scripts/utils";

requestData();
addPhotoModal();
showDeleteWrappers();
editProfileModal();
createAlbumModal();
editAlbumModal();
calendarToken();
loader(albumsIdeasData);