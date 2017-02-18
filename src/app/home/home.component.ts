import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';

import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Image, Action, ImageModalEvent } from 'angular-modal-gallery';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    Title
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  // Set our default values
  public localState = { value: '' };
  // ---------------------------------------------------------------------------------
  // angular-modal-gallery
  public openModalWindow: boolean = false;
  public imagePointer: number = 0;

  public openModalWindowObservable: boolean = false;
  public imagePointerObservable: number = 0;

  public imagesArray = [
    new Image(
      '../../assets/images/gallery/thumbs/img1.jpg',
      '../../assets/images/gallery/img1.jpg',
      'Image 1'
    ),
    new Image(
      '../../assets/images/gallery/thumbs/img2.jpg',
      '../../assets/images/gallery/img2.jpg',
      'Image 2'
    ),
    new Image(
      '../../assets/images/gallery/thumbs/img3.jpg',
      '../../assets/images/gallery/img3.jpg',
      'Image 3'
    ),
    new Image(
      '../../assets/images/gallery/thumbs/img4.jpg',
      '../../assets/images/gallery/img4.jpg',
      'Image 4'
    ),
    new Image(
      '../../assets/images/gallery/thumbs/img5.jpg',
      '../../assets/images/gallery/img5.jpg',
      'Image 5'
    )
  ];

  // observable of an array of images with a delay to simulate a network request
  public images: Observable<Image[]> = Observable.of(this.imagesArray).delay(300);

  // array with a single image inside (the first one)
  public singleImage: Observable<Image[]> = Observable.of([
    new Image(
      '../../assets/images/gallery/thumbs/img1.jpg',
      '../../assets/images/gallery/img1.jpg',
      'Image 1'
    )]
  );
  private subscription: Subscription;

  // --------------------------------------------------------------------------------
  // TypeScript public modifiers
  constructor(
    public appState: AppState,
    public title: Title
  ) {}

  public ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }

  // ----------------------
  // angular-modal-gallery
  public openImageModal(image: Image) {
    this.imagePointer = this.imagesArray.indexOf(image);
    this.openModalWindow = true;
  }

  public openImageModalObservable(image: Image) {
    this.subscription = this.images.subscribe((val: Image[]) => {
      this.imagePointer = val.indexOf(image);
      this.openModalWindow = true;
    });
  }

  public onImageLoaded(event: ImageModalEvent) {
    // angular-modal-gallery will emit this event if it will load successfully input images
    console.log('onImageLoaded action: ' + Action[event.action]);
    console.log('onImageLoaded result:' + event.result);
  }

  public onVisibleIndex(event: ImageModalEvent) {
    console.log('action: ' + Action[event.action]);
    console.log('result:' + event.result);
  }

  public onIsFirstImage(event: ImageModalEvent) {
    console.log('onfirst action: ' + Action[event.action]);
    console.log('onfirst result:' + event.result);
  }

  public onIsLastImage(event: ImageModalEvent) {
    console.log('onlast action: ' + Action[event.action]);
    console.log('onlast result:' + event.result);
  }

  public onCloseImageModal(event: ImageModalEvent) {
    console.log('onClose action: ' + Action[event.action]);
    console.log('onClose result:' + event.result);
    this.openModalWindow = false;
  }

  // release resources for example 5
  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  // ----------------------
}
