import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { ToastyService, ToastOptions } from 'ng2-toasty';
import { FileUploader, FileUploaderOptions, FileSelectDirective, FileDropDirective } from 'ng2-file-upload';

import { Ticket } from '../../models/Ticket';

const URL = 'api/File/Upload';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  public hasBaseDropZoneOver: boolean = false;

  fileUploader: FileUploader;

  model = new Ticket();

  constructor(
    private toastyService: ToastyService,
    private router: Router) { }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit() {
    this.initUploader();
  }

  initUploader() {
    this.fileUploader = new FileUploader(
      <FileUploaderOptions>{
        url: URL,
        headers: [
          { name: 'X-XSRF-TOKEN', value: this.getCookie('XSRF-TOKEN') },
          { name: 'Accept', value: 'application/json' }
        ],
        isHTML5: true,
        allowedMimeType: ['image/jpeg', 'text/csv', 'application/json', 'application/zip'],
        removeAfterUpload: false,
        autoUpload: false,
        maxFileSize: 100 * 1024 * 1024
      }
    );

    this.fileUploader.onBuildItemForm = (fileItem, form) => {
      for (const key in this.model) {
        if (this.model.hasOwnProperty(key)) {
          form.append(key, this.model[key]);
        }
      }
    };

    this.fileUploader.onCompleteAll = () => {
      this.toastyService.success(
        <ToastOptions>{
          title: 'Erfolg!',
          msg:
          'Upload erfolgreich durchgeführt!',
          theme: 'default',
          showClose: true,
          timeout: 15000
        }
      );

      this.router.navigate(['/database/', 3]);
    };

    this.fileUploader.onWhenAddingFileFailed = (item, filter, options) => {
      this.toastyService.error(
        <ToastOptions>{
          title: 'Error!',
          msg: `${item.name} kann nicht ausgewählt werden da es nicht dem ${filter.name}-Filter entspricht. Erlaubte Fileformate sind .JSON und .JPG.`,
          theme: 'default',
          showClose: true,
          timeout: 15000
        }
      );
    };

    this.fileUploader.onErrorItem = (fileItem, response, status, headers) => {
      this.toastyService.error(
        <ToastOptions>{
          title: 'Error uploading file!',
          msg: `${response} -> ${fileItem.file.name}`,
          theme: 'bootstrap',
          showClose: true,
          timeout: 15000
        }
      );
    };

    this.fileUploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const ticket = JSON.parse(response);
        console.log(`ticket:`, ticket);
      }
    };
  }

  getCookie(name: string): string {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(';').shift());
    }
  }

}
