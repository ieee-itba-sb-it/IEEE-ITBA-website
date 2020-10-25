import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  constructor(private route: ActivatedRoute) { 
    
  }

  ngOnInit(): void {
      var forum_title: string = this.route.snapshot.paramMap.get("forum_title");
      var cat_title: string = this.route.snapshot.paramMap.get("cat_title");
      var tid: string = this.route.snapshot.paramMap.get("tid");

      console.log(forum_title);
      console.log(cat_title);
      console.log(tid);



      if (tid != null && cat_title != null && forum_title != null){
 
        window.location.replace(
          `https://curso.whittileaks.com/f/${forum_title}/c/${cat_title}/${tid}`
        );

      }else if (cat_title != null && forum_title != null){

        window.location.replace(
          `https://curso.whittileaks.com/f/${forum_title}/c/${cat_title}`
        );

      }else if (forum_title != null){

        window.location.replace(
          `https://curso.whittileaks.com/f/${forum_title}`
        );
        
      }else{

        window.location.replace(
          `https://curso.whittileaks.com/f`
        );

      }





    
  }

}
