# maisocial
Web service for viewing maimai songs.

## Populate
Typescript scripts for populating song data to MongoDB.

Chart constant is sourced from [@maiLv_Chihooooo](https://x.com/maiLv_Chihooooo)'s sheet.

## API
MongoDB + NestJS backend. Service is hosted on render.com, while data is stored on the free tier of MongoDB Atlas Database.

## Web
Next.js frontend.

## To-do
- Add documentation on how to initialize each module
- Clean up code
- Scrape BPM data from gamerch
- Save song thumbnail, compress, upload to cloudinary
- Add Google auth using supabase + comment section per song
- Support utage songs