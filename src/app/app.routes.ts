import { Routes } from '@angular/router';
import { ItemDetailsComponent } from './features/collection/item-details/item-details.component';
import { AddCollComponent } from './features/collection/add-coll/add-coll.component';
import { AddItemComponent } from './features/collection/add-item/add-item.component';
import { CollDetailsComponent } from './features/collection/coll-details/coll-details.component';
import { CollListComponent } from './features/collection/coll-list/coll-list.component';
import { CollectionComponent } from './features/collection/collection.component';
import { LoginComponent } from './features/login/login.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { SearchComponent } from './features/search/search.component';
import { MovieDetailsComponent } from './features/search/movie-details/movie-details.component';


export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', title: 'Login', component: LoginComponent},
    { path: 'search', title: "Search", component: SearchComponent},
    { path: 'movie/:id', title: 'Movie Details', component: MovieDetailsComponent},
    { path: 'coll', title: 'Collections', component: CollectionComponent, children: [ 
        { path: '', component: CollListComponent },
        { path: 'add-coll', component: AddCollComponent },
        { path: ':coll-id', component: CollDetailsComponent},
        { path: ':coll-id/add-item', component: AddItemComponent},
        { path: ':coll-id/:item-id', component: ItemDetailsComponent }
    ]},
    { path: 'not-found', title: 'Not Found', component: NotFoundComponent},
    { path: '**', redirectTo: 'not-found' },
];
