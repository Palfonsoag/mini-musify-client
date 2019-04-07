import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

//import user components

import { UserEditComponent } from "./components/user-edit.component";
import { ArtistListComponent } from "./components/artist-list.component";
import { ArtistAddComponent } from "./components/artist-add.component";
import { HomeComponent } from "./components/home.component";
import { ArtistEditComponent } from "./components/artist-edit.component";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "editar-artista/:id", component: ArtistEditComponent },
  { path: "artist/:page", component: ArtistListComponent },
  { path: "crear-artista", component: ArtistAddComponent },
  { path: "mis-datos", component: UserEditComponent },
  { path: "**", component: HomeComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
