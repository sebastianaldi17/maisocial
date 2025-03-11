import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SongsModule } from "./songs/songs.module";
import { ConfigModule } from "@nestjs/config";
import { CommentsModule } from "./comments/comments.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SongsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
