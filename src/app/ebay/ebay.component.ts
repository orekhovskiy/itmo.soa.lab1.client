import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Response } from 'src/utils/Types'
import { EbayService } from './ebay.service';
@Component({
  selector: 'app-ebay',
  templateUrl: './ebay.component.html',
  styleUrls: ['./ebay.component.css'],
  providers: [EbayService]
})
export class EbayComponent implements OnInit {

  resources: String[] = [
    '/manufacture-cost/',
    '/unit-of-measure/'
  ]
  value: FormControl = new FormControl('');
  selectedResource = this.resources[1];
  isLoading = false;
  response: Response = new Response();

  constructor(private ebayService: EbayService) { }

  ngOnInit(): void {
  }

  setResource(res) {
    this.selectedResource = res;
  }

  sendRequest() {
    this.isLoading = true;
    this.ebayService.sendRequest(this.selectedResource, this.value.value).subscribe(
      (data) => {
        this.isLoading = false;
        var products = this.ebayService.castXmlToObjectsArray(data);
        this.response.setProducts(products);
        this.response.setMessage(products.length > 0 ? '' : data === '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><products/>'? 'Empty set' : data);
        this.response.setStatusCode(-1);
      },
      (error) => {
        this.isLoading = false;
        this.response.setMessage(typeof error.error === 'string' ? error.error : '');
        this.response.setProducts([]);
        this.response.setStatusCode(error.status);
      }
    );
  }

}
