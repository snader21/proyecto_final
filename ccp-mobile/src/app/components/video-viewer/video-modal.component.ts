import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
    selector: 'app-video-modal',
    templateUrl: './video-modal.component.html',
    styleUrls: ['./video-modal.component.scss'],
    standalone: true,
    imports: [IonicModule]
})
export class VideoModalComponent implements OnInit {
  @Input() url!: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    console.log('URL del video:', this.url);
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}
