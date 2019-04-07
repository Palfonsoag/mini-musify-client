import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";
import { UploadService } from "../services/upload.service";
import { Artist } from "../models/artist";

@Component({
  selector: "artist-edit",
  templateUrl: "../views/artist-add.html",
  providers: [UserService, ArtistService, UploadService]
})
export class ArtistEditComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public url: string;
  public token;
  public alertMessage;
  public is_edit;
  public filesToUpload: Array<File>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _uploadService: UploadService
  ) {
    this.titulo = "Editar Artista";
    this.identity = this._userService.getIdentity();
    console.log(this.identity);
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist("", "", "");
    this.is_edit = true;
  }

  ngOnInit() {
    console.log("artist-artist-component.ts cargado");
    this.getArtist();
  }
  getArtist() {
    this._route.params.forEach((params: Params) => {
      let id = params["id"];
      this._artistService.getSingleArtist(this.token, id).subscribe(
        response => {
          if (!response.artist) {
            this._router.navigate(["/"]);
          } else {
            this.artist = response.artist;
          }
        },
        error => {
          var errorMessage = <any>error;
          if (errorMessage != null) {
            let body = JSON.parse(error._body);
            //this.errorMessageCreate = body.message;
          }
        }
      );
    });
  }

  onSubmit() {
    console.log(this.artist);
    this._route.params.forEach((params: Params) => {
      let id = params["id"];
      this._artistService.editArtist(this.token, id, this.artist).subscribe(
        res => {
          if (!res.artist) {
            this.alertMessage = "Error en el servidor";
          } else {
            this.alertMessage = "Artista Actualizado";
            this._uploadService
              .makeFileRequest(
                this.url + "upload-image-artist/" + id,
                [],
                this.filesToUpload,
                this.token,
                "image"
              )
              .then(
                result => {
                  this._router.navigate(["/artist/1"]);
                },
                error => {
                  console.log(error);
                }
              );
            //this.artist = res.artist;
            //this._router.navigate(["/editar-artista"], response.artist._id);
          }
        },
        error => {
          var errorMessage = <any>error;
          if (errorMessage != null) {
            let body = JSON.parse(error._body);
            //this.errorMessageCreate = body.message;
          }
        }
      );
    });
  }
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
