import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { GLOBAL } from "../services/global";

@Component({
  selector: "user-edit",
  templateUrl: "../views/user-edit.html",
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public titulo: string;
  public user: User;
  public identity;
  public token;
  public errorMessageUpdate;
  public alertUpdate;
  public filesToUpload: Array<File>;
  public url: string;

  constructor(private _userService: UserService) {
    //localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    //component variables
    this.titulo = "Actualizar mis datos";
    this.user = this.identity;
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log("user-edit.component.ts cargado");
  }

  onSubmit() {
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user) {
          this.errorMessageUpdate = "usuario no actualizado";
        } else {
          // this.user = response.user;
          localStorage.setItem("idenity", JSON.stringify(this.user));
          document.getElementById("identity_name").innerHTML = this.user.name;
          if (!this.filesToUpload) {
            //Redireccion
          } else {
            this.makeFileRequest(
              this.url + "upload-image-user/" + this.user._id,
              [],
              this.filesToUpload
            ).then((result: any) => {
              this.user.image = result.image;
              let image_path = this.url + "get-image-user/" + this.user.image;
              document
                .getElementById("image-logged")
                .setAttribute("src", image_path);
              localStorage.setItem("idenity", JSON.stringify(this.user));
              console.log(this.user);
            });
          }

          this.alertUpdate = "usuario actualizado";
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          let body = JSON.parse(error._body);
          this.errorMessageUpdate = body.message;
        }
      }
    );
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    let token = this.token;
    return new Promise(function(resolve, reject) {
      let formData: any = new FormData();
      let xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append("image", files[i], files[i].name);
      }
      /*files.forEach(file => {
        formData.append("image", file, file.name);
      });*/
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Authorization", token);
      xhr.send(formData);
    });
  }
}
