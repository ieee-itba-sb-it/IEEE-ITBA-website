import { Component, AfterViewInit } from '@angular/core';
declare var anime: any;              // declare like this

@Component({
  selector: 'app-error401',
  templateUrl: './error401.component.html',
  styleUrls: ['./error401.component.css']
})
export class Error401Component implements AfterViewInit  {
  
  ngAfterViewInit(): void {
      // Wrap every letter in a span
  const textWrapper = document.querySelector('.an-1');
  textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: false})
  .add({
    targets: '.an-1 .letter',
    scale: [4,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 950,
    delay: (el, i) => 70*i
  })


  }
}
