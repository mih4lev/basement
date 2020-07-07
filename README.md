API:

## API /api/profile/settings

##### GET /api/profile/settings
used to request profile page data
##### POST /api/profile/settings
use on register user, save profile data
- firstName [string]
- lastName [string]
- userName [string]
- userMail [string]
- userPassword [string]
##### PUT /api/profile/settings
use on profile modal, update profile data (form-data)
- avatarPhoto [file]
- firstName [string]
- lastName [string]
- userName [string]
- userMail [string]
- userID [number]

## API /api/profile/albums

##### GET /api/profile/albums
used to request all profile albums data
##### GET /api/profile/albums/:albumID
used to request profile current album data
##### POST /api/profile/albums
used to create profile album
##### PUT /api/profile/albums
used to update profile album
##### DELETE /api/profile/albums
used to delete profile album

## API /api/profile/ideas

##### GET /api/profile/ideas
used to request all profile ideas
##### GET /api/profile/ideas/album/:albumID
used to request profile current saved album ideas
##### GET /api/profile/ideas/:ideaID
used to request current saved idea data
##### POST /api/profile/ideas/
used to save idea to album
##### DELETE /api/profile/ideas
used to delete saved ideas

## API /api/ideas

##### GET /api/ideas
used to request all ideas by added date


##### POST /api/ideas
used to save idea for moderate
##### PUT /api/ideas
used to update created ideas by a moderator (not user)
##### DELETE /api/ideas
used to remove created ideas (user && moderator)

