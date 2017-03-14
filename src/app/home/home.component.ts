import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Image, Action, ImageModalEvent, Description } from 'angular-modal-gallery';

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

  public imagesArray: Image[] = [
    new Image(
      '../../../../assets/images/gallery/img1.jpg',
      null, // no thumb
      null, // no description
      'http://www.google.com'
    ),
    new Image(
      '../../../../assets/images/gallery/img2.png', // example with a PNG image
      null, // no thumb
      'Description 2',
      null // url
    ),
    new Image(
      '../../../../assets/images/gallery/img3.jpg',
      '../../../../assets/images/gallery/thumbs/img3.png', // example with a PNG thumb image
      'Description 3',
      'http://www.google.com'
    ),
    new Image(
      '../../../../assets/images/gallery/img4.jpg',
      null, // no thumb
      'Description 4',
      'http://www.google.com'
    ),
    new Image(
      '../../../../assets/images/gallery/img5.jpg',
      '../../../../assets/images/gallery/thumbs/img5.jpg',
      null, // no description
      null // url
    )
  ];

  // observable of an array of images with a delay to simulate a network request
  public images: Observable<Image[]> = Observable.of(this.imagesArray).delay(300);

  // array with a single image inside (the first one)
  public singleImage: Observable<Image[]> = Observable.of([
    new Image(
      '../../../../assets/images/gallery/img1.jpg',
      '../../../../assets/images/gallery/thumbs/img1.jpg',
      'Description 1',
      'http://www.google.com'
    )]
  );

  // array of images initialized inside the onNgInit() of this component
  // in an asynchronous way subscribing to an Observable with a delay.
  // This is not a real use-case, but it's a way to simulate a scenario where
  // you have to subscribe to an Observable to get data and to set public vars
  public imagesArraySubscribed: Image[];

  public customDescription: Description = {
    imageText: 'Look this image ',
    numberSeparator: ' of ',
    beforeTextDescription: ' => '
  };

  public customFullDescription: Description = {
    // you should build this value programmaticaly with the result of (show)="..()" event
    customFullDescription: 'Custom description of the current visible image',
    // if customFullDescription !== undefined, all other fields will be ignored
    // imageText: '',
    // numberSeparator: '',
    // beforeTextDescription: '',
  };

  private subscription: Subscription;
  private imagesArraySubscription: Subscription;
  // --------------------------------------------------------------------------------
  // TypeScript public modifiers
  constructor(
    public appState: AppState,
    public title: Title
  ) {}

  public ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
    this.imagesArraySubscription = Observable.of(null).delay(500).subscribe(() => {
      this.imagesArraySubscribed = this.imagesArray;
    });
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
      this.imagePointerObservable = val.indexOf(image);
      this.openModalWindowObservable = true;
    });
  }

  public onImageLoaded(event: ImageModalEvent) {
    // angular-modal-gallery will emit this event if it will load successfully input images
    console.log('onImageLoaded action: ' + Action[event.action]);
    console.log('onImageLoaded result:' + event.result);
  }

  public onVisibleIndex(event: ImageModalEvent) {
    this.customFullDescription.customFullDescription = `Custom description of visible image with index= ${event.result}`;
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
    this.openModalWindowObservable = false;
  }

  public addRandomImage() {
    this.imagesArray.push(this.imagesArray[Math.floor(Math.random() * this.imagesArray.length)]);
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.imagesArraySubscription) {
      this.imagesArraySubscription.unsubscribe();
    }
  }
  // ----------------------
}
