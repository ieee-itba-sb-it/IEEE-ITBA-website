import { Component, OnInit, Input } from '@angular/core';
import { Person } from './person';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})
export class TeamCardComponent implements OnInit {

  peopleCD = [
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar",'HOME.CARGO.CS.PRESIDENTE'),
    new Person("Nadia Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","nadia@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE")
  ];

  peopleMediacom = [
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar",'HOME.CARGO.CS.PRESIDENTE'),
    new Person("Nadia Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","nadia@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE")
  ];

  peopleID = [
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar",'HOME.CARGO.CS.PRESIDENTE'),
    new Person("Nadia Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","nadia@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE")
  ];

  peopleFundr = [
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar",'HOME.CARGO.CS.PRESIDENTE'),
    new Person("Nadia Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","nadia@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE")
  ];

  peopleEdu = [
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar",'HOME.CARGO.CS.PRESIDENTE'),
    new Person("Nadia Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","nadia@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE")
  ];

  peopleWIE = [
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar",'HOME.CARGO.CS.PRESIDENTE'),
    new Person("Nadia Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","nadia@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE")
  ];

  peopleCS = [
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar",'HOME.CARGO.CS.PRESIDENTE'),
    new Person("Nadia Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","nadia@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE"),
    new Person("Lucas Vidmar","https://i.ibb.co/8P3trjg/lucasvidmar.jpg","https://www.linkedin.com/in/lucasvidmar/","lvidmar@itba.edu.ar","PRESIDENTE")
  ];

  @Input() type: string;

  constructor() { }

  ngOnInit(): void {
  }

}
