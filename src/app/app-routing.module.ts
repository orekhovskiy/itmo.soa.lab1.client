import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EbayComponent } from './ebay/ebay.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  {path: 'service1', component: ProductComponent},
  {path: 'service2', component: EbayComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
