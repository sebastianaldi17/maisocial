import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SongsModule } from "./songs/songs.module";
import { ConfigModule } from "@nestjs/config";
import { CommentsModule } from "./comments/comments.module";
import { UsersModule } from "./users/users.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { PlaylistsModule } from "./playlists/playlists.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    SongsModule,
    CommentsModule,
    UsersModule,
    PlaylistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
