import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.css']
})
export class ProfilePictureComponent {
    @Input() src?: string;
    @Input() size?: string;
    @Input() tooltip?: string = "";

    defaultImage = '../../../../../assets/image/logos/user.png';

    constructor() {
        if (!this.size) this.size = '100px';
    }
}
