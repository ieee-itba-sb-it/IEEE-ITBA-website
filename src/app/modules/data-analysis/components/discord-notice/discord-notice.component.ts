import {Component} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {DISCORD_URL} from 'src/app/shared/models/event/data_analysis/inscription';

// Invitation to the course Discord server, shown to enrolled students
@Component({
    selector: 'app-discord-notice',
    standalone: true,
    imports: [TranslateModule],
    templateUrl: './discord-notice.component.html',
    styleUrls: ['./discord-notice.component.css']
})
export class DiscordNoticeComponent {
    readonly discordUrl = DISCORD_URL;
}
