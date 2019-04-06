import { Component, OnInit } from "@angular/core";
import { User } from "./models/user";
import { UserService } from "./services/user.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = "Mini Musify";
  public user: User;
  public identity;
  public token;
  public errorMessage;

  constructor(private _userService: UserService) {
    this.user = new User("", "", "", "", "", "ROLE_USER", "");
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit() {
    this._userService.signUp(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if (!this.identity._id) {
          alert("El usuario no esta correctamente identificado");
        } else {
          //crea una sesion en el local storage
          //conseguir el token para las peticiones http
          localStorage.setItem("identity", JSON.stringify(identity));

          this._userService.signUp(this.user, true).subscribe(
            response => {
              let token = response.token;
              this.token = token;

              if (this.token.length <= 0) {
                alert("El token no se ha generado Correctamente");
              } else {
                localStorage.setItem("token", token);
              }
            },
            error => {
              var errorMessage = <any>error;
              if (errorMessage != null) {
                let body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          let body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }

  public logOut() {
    localStorage.removeItem("identity");
    localStorage.removeItem("token");
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }
}
