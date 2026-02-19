import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CollectionComponent } from './pages/collection/collection.component';
import { CollListComponent } from './pages/collection/coll-list/coll-list.component';
import { CollDetailsComponent } from './pages/collection/coll-details/coll-details.component';
import { AddItemComponent } from './pages/collection/add-item/add-item.component';
import { AddCollComponent } from './pages/collection/add-coll/add-coll.component';
import { ItemDetailsComponent } from './pages/collection/item-details/item-details.component';

export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', title: 'Login', component: LoginComponent},
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
