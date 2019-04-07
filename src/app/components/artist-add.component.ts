import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";
import { Artist } from "../models/artist";

@Component({
  selector: "artist-add",
  templateUrl: "../views/artist-add.html",
  providers: [UserService, ArtistService]
})
export class ArtistAddComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public url: string;
  public token;
  public alertMessage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService
  ) {
    this.titulo = "Crear nuevo";
    this.identity = this._userService.getIdentity();
    console.log(this.identity);
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist("", "", "");
  }

  ngOnInit() {
    console.log("artist-add-component.ts cargado");
  }
  onSubmit() {
    console.log(this.artist);
    this._artistService.addArtist(this.token, this.artist).subscribe(
      res => {
        if (!res.artist) {
          this.alertMessage = "Error en el servidor";
        } else {
          this.alertMessage = "Artista creado";
          this.artist = res.artist;
          this._router.navigate(["/editar-artista", res.artist._id]);
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
  }
}
