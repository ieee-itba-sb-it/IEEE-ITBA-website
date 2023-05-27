import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BlogService } from '../../../../core/services/blog/blog.service';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router';
import { NewsItem } from '../../../../shared/models/news-item/news-item';
import { createNewsItem } from '../../../../shared/models/data-types';
import Timestamp = firestore.Timestamp;
import { blogCollectionName } from '../../../../secrets';
import { MatSnackBar } from '@angular/material/snack-bar';
import { sanitizeString } from '../../utils';
import {AuthService} from '../../../../core/services/authorization/auth.service';
import {Observable} from 'rxjs';
import {IEEEuser} from '../../../../shared/models/ieee-user/ieee-user';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import firebase from 'firebase';

@Component({
  selector: 'app-write-news',
  templateUrl: './write-news.component.html',
  styleUrls: ['./write-news.component.css']
})
export class WriteNewsComponent implements OnInit {

  editorForm: FormGroup;
  user: IEEEuser;
  durationInSeconds = 5;
  newsContent: NewsItem;
  textContent = '';
  today = firebase.firestore.Timestamp.now().toDate();
  minDate = firebase.firestore.Timestamp.now().toDate();
  formControlDate = new FormControl(this.minDate);
  publishNow = true;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagControl = new FormControl();
  filteredTags: Observable<string[]>;

  hasShortIntro = false;
  allTags: string[] = [];
  newsTagMap = {};

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private router: Router, private route: ActivatedRoute, private blogService: BlogService, private snackBar: MatSnackBar, private authService: AuthService) {
    this.filteredTags = this.tagControl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice())
    );
    this.user = {
      fname: '',
      lname: '',
      email: '',
      photoURL: '',
      uID: '',
      role: 0
    };
    this.newsContent = {
      title: '',
      shortIntro: '',
      content: '',
      imageUrl: '',
      author: '',
      reference: '',
      date: this.minDate,
      imageText: '',
      listed: true,
      tags: [],
      ratings: [],
    };
    this.blogService.setCollectionName(blogCollectionName);
    this.blogService.getDocsTagsAsObservable().subscribe((tags: string[]) => {
      this.allTags = tags;
    });
    this.editorForm = new FormGroup({
      editor: new FormControl(null)
    });
    this.authService.getCurrentUser().subscribe((value: IEEEuser) => {
      if (value != null) {
        this.user = value;
      }
    });
    // Programmed date must be at least tomorrow
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  dateFormatted() {
    return this.newsContent.date.toLocaleDateString();
  }

  changedDate($event) {
   this.newsContent.date = $event.value;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.newsTagMap[this.sanitizeTag(value)] = true;
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagControl.setValue(null);
  }

  remove(tag: string): void {
    delete this.newsTagMap[this.sanitizeTag(tag)];
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.newsTagMap[this.sanitizeTag(event.option.viewValue)] = true;
    this.tagInput.nativeElement.value = '';
    this.tagControl.setValue(null);
  }

  sanitizeTag(toSanitize: string) {
    return toSanitize.charAt(0).toUpperCase() + toSanitize.slice(1).toLowerCase();
  }

  currentTags() {
    return Object.keys(this.newsTagMap);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {

  }

  splitContent() {
    const breakCharacter = '</p>';
    const breakCharacterIdx = this.textContent.indexOf(breakCharacter);

    if (this.hasShortIntro) {
      let skippedCharacters = breakCharacter.length;
      this.newsContent.shortIntro = this.textContent.substring(0, breakCharacterIdx + skippedCharacters);
      if (this.newsContent.shortIntro.length > 0) {
        skippedCharacters = breakCharacter.length;
      }
      this.newsContent.content = this.textContent.substring(breakCharacterIdx + skippedCharacters);
      console.log(this.newsContent.content);
    } else {
      this.newsContent.shortIntro = '';
      this.newsContent.content = this.textContent;
    }
  }

  updateNewsText($event) {
    console.log($event.html);
    // this.textContent = $event.text;
    this.textContent = $event.html;
    this.splitContent();
  }

  submitNews() {
    /*
    // Values read from inputs
    const title = (document.getElementById('title') as HTMLInputElement).value;
    const imageUrl = (document.getElementById('imageUrl') as HTMLInputElement).value;
    const imageText = (document.getElementById('imageText') as HTMLInputElement).value;

    // Parse text and split into pampadour (text before image) and content (after image)
    const text = document.getElementsByClassName('ql-editor')[0].innerHTML;
    const [shortIntro, content] = this.parseContentText(text);

    // Taken from current user
    const author = this.user.fname + ' ' + this.user.lname;

    const listed = (document.getElementById('listed') as HTMLInputElement).checked;
    const reference =  encodeURIComponent( sanitizeString( title ) );
    const tags = ['tecnología'];

    const ratings = [0, 0, 0, 0, 0];

    if (title !== '') {
      this.blogService.setDoc(
        createNewsItem(
          title,
          content,
          shortIntro,
          imageUrl,
          Timestamp.fromDate(new Date()),
          author,
          imageText,
          reference,
          tags,
          listed,
          ratings
        )
      ).subscribe(sent => {
        if (sent) {
          this.router.navigate([`/noticias/${reference}`]);
        }
      });
    } else {
      this.blogService.deleteDoc(reference).subscribe(sent => {
        if (sent) {
          this.router.navigate([`/noticias`]);
        }
      });
    }

     */
  }

  openSnackBar() {
    this.snackBar.open('No se pudo subir la noticia', 'Cerrar', {
      duration: this.durationInSeconds * 1000,
    });
  }

  printEvent($event) {
    console.log($event);
  }

}
