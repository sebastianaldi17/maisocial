import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ConfigService } from "@nestjs/config";
import { CommentsService } from "src/comments/comments.service";
import { PlaylistsService } from "src/playlists/playlists.service";

@Injectable()
export class UsersService {
  private supabase: SupabaseClient;

  constructor(
    private configService: ConfigService,
    private commentsService: CommentsService,
    private playlistsService: PlaylistsService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>("SUPABASE_URL") || "",
      this.configService.get<string>("SUPABASE_SERVICE_ROLE_KEY") || "",
    );
  }

  async updateNickname(userId: string, nickname: string) {
    const { error } = await this.supabase.auth.admin.updateUserById(userId, {
      user_metadata: { nickname },
    });

    if (error) {
      throw new Error(error.message);
    }

    await this.commentsService.updateCommentNickname(userId, nickname);
    await this.playlistsService.updatePlaylistNickname(userId, nickname);
  }
}
