export const DB_NAME = "PlayTube";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const allowedTypesFileTypes = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/jpg",
  "video/mp4",
]);

// cookies config
export const cookiesOptions = Object.freeze({
  httpOnly: true,
  secure: true,
});

export const __PhotoDir = {
  AVATAR: "Photos/Avatars",
  COVERIMAGE: "Photos/CoverImages",
};
