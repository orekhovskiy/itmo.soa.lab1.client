import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Template } from 'src/utils/Template';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ProductService]
})
export class ProductComponent implements OnInit {

  template: Template = new Template('', '');
  isXml: boolean = false;
  methods: String[] = ['GET', 'POST', 'DELETE', 'PUT'];
  templates: Template[] = [
    // получение по ид: GET /products/id/{id}
    new Template('GET', '/products/id/{id}'),
    // расчет средней цены производителя : GET /products/manufacture-cost/average
    new Template('GET', '/products/manufacture-cost/average'),
    // получение всех: GET /products
    new Template('GET', '/products'),
    // добавление нового: POST /products
    new Template('POST', '/products'),
    // удаление: DELETE /products/id/{id}
    new Template('DELETE', '/products/id/{id}'),
    // удаление всех где есть овнер: DELETE /products/owner (в боди объект)
    new Template('DELETE', '/products/owner'),
    // удалить любой где есть прайс: DELETE /products/price/{price}
    new Template('DELETE', '/products/price/{price}'),
    // обновление: PUT /products
    new Template('PUT', '/products'),
  ];
  pathParams: Param[] = [];
  queryParams: Param[] = [];
  preparedQueryParams: Param[] = [
    { key: 'page-number', value: '', enabled: false },
    { key: 'page-capacity', value: '', enabled: false },
  ];
  bodyProduct: BodyProduct = new BodyProduct();

  constructor(private readonly productService: ProductService) { }

  ngOnInit(): void { 
    this.productService.castObjectToXML();
  }

  setTemplate(template: Template) {
    this.template = new Template(template.getMethod(), template.getUrl());
  }

  removeParam(key: String, value: String, paramType: String) {
    let index = -1;
    let params;
    switch (paramType) {
      case 'path': 
        params = this.pathParams;
        break;
      case 'query':
        params = this.queryParams;
        break;
    }

    for (let i = 0; i < params.length; i++) {
      if (params[i].key === key && params[i].value === value)
        index = i;
    }
    console.log(index);
    if (index > -1) {
      params.splice(index, 1);
    }
  }

  addParam(paramType: String) {
    const key = (<HTMLInputElement>document.getElementById(`${paramType}-param-key`)).value;
    const value = (<HTMLInputElement>document.getElementById(`${paramType}-param-value`)).value;
    if (key && value) {
      switch (paramType) {
        case 'path': 
        this.pathParams.push({key: key, value: value});
          break;
        case 'query':
          this.queryParams.push({key: key, value: value});
          break;
      }
      (<HTMLInputElement>document.getElementById(`${paramType}-param-key`)).value = '';
      (<HTMLInputElement>document.getElementById(`${paramType}-param-value`)).value = '';
    }
  }

  generateUrl(): String {
    let pathParams = '';
    let queryParams = '';
    for (let pathParam of this.pathParams) {
      pathParams += `/${pathParam.key}/${pathParam.value}`;
    }
    for (let prep of this.preparedQueryParams) {
      if (prep.enabled) {
        let id = `prep-param-${prep.key}`;
        queryParams += `${prep.key}=${prep.value}&`;
      }
    }
    for (let queryParam of this.queryParams) {
      queryParams += `${queryParam.key}=${queryParam.value}&`;
    }
    queryParams = queryParams.slice(0, -1);
    return queryParams
      ? `${this.template.getUrl()}${pathParams}?${queryParams}`
      : `${this.template.getUrl()}${pathParams}`;
      
  }

  updateValue(key: String) {
    for (let prep of this.preparedQueryParams) {
      if (prep.key === key) {
        prep.value = (<HTMLInputElement>document.getElementById(`prep-key-${key}`)).value;
      }
    }
  }
}

interface Param {
  key: String;
  value: String;
  enabled?: boolean;
}
class BodyElement {
  value: FormControl = new FormControl('');
  isEnabled: boolean = false;
}
class BodyProduct {
  isEnabled: boolean = true;
  id: BodyElement = new BodyElement;
  name: BodyElement = new BodyElement;
  coordinates: BodyCoordinates = new BodyCoordinates;
  creationDate: BodyElement = new BodyElement;
  price: BodyElement = new BodyElement;
  partNumber: BodyElement = new BodyElement;
  manufactureCost: BodyElement = new BodyElement;
  unitOfMeasure: BodyElement = new BodyElement;
  person: BodyPerson = new BodyPerson;
}
class BodyCoordinates {
  isEnabled: boolean = false;
  x: BodyElement = new BodyElement;
  y: BodyElement = new BodyElement;
}
class BodyPerson {
  isEnabled: boolean = false;
  name: BodyElement = new BodyElement;
  weight: BodyElement = new BodyElement;
  country: BodyElement = new BodyElement;
  location: BodyLocation = new BodyLocation;
}
class BodyLocation {
  isEnabled: boolean = false;
  x: BodyElement = new BodyElement;
  y: BodyElement = new BodyElement;
  z: BodyElement = new BodyElement;
}
