import { Component, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-recorder',
  templateUrl: './video-recorder.component.html',
  styleUrls: ['./video-recorder.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class VideoRecorderComponent implements OnDestroy {
  @ViewChild('previewVideo') previewVideoElement!: ElementRef<HTMLVideoElement>;
  @Output() videoRecorded = new EventEmitter<string>();

  videoURL: string | null = null;
  isRecording = false;
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;

  constructor(private modalCtrl: ModalController) {}

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: true,
      });

      this.stream = stream;
      this.previewVideoElement.nativeElement.srcObject = stream;
      this.previewVideoElement.nativeElement.play();

      this.mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        this.videoURL = URL.createObjectURL(videoBlob);
        this.videoRecorded.emit(this.videoURL);
        await this.dismiss();
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      this.isRecording = false;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      this.isRecording = false;
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }

  async dismiss() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    await this.modalCtrl.dismiss(this.videoURL);
  }

  ngOnDestroy() {
    if (this.videoURL) {
      URL.revokeObjectURL(this.videoURL);
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
} 