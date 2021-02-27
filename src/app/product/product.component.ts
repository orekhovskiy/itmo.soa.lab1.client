import { Component, OnInit } from '@angular/core';
import { BodyProduct, Param, Template, Response, Alert } from 'src/utils/Types';
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
    new Template('GET', '/products/{id}'),
    // расчет средней цены производителя : GET /products/manufacture-cost/average
    new Template('GET', '/products/manufacture-cost/average'),
    // получение всех: GET /products
    new Template('GET', '/products'),
    // удаление: DELETE /products/id/{id}
    new Template('DELETE', '/products/{id}'),
    // удаление всех где есть овнер: DELETE /products/owner (в боди объект)
    new Template('DELETE', '/products/owner'),
    // удалить любой где есть прайс: DELETE /products/price/{price}
    new Template('DELETE', '/products/price/{price}'),
    // добавление нового: POST /products
    new Template('POST', '/products'),
    // обновление: PUT /products
    new Template('PUT', '/products/{id}'),
  ];
  pathParams: Param[] = [];
  queryParams: Param[] = [];
  preparedQueryParams: Param[] = [
    { key: 'page-number', value: '', enabled: false },
    { key: 'page-capacity', value: '', enabled: false },
  ];
  bodyProduct: BodyProduct = new BodyProduct();
  textArea: String;
  isRequestShown: boolean = true;
  response: Response = new Response();
  alert: Alert = new Alert;
  isLoading: boolean = false;

  constructor(private readonly productService: ProductService) { }

  ngOnInit(): void { }

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

  getXmlView(): String {
    return this.productService.castObjectToXML(this.bodyProduct);
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

  sendRequest() {
    let url = (<HTMLInputElement>document.getElementById('url')).value;
    let method = this.template.getMethod();
    if (!url) {
      this.alert.isVisible = true;
      this.alert.text = 'Please specify the url.';
      this.alert.bootstrapType = 'warning';
    }
    else if (!method) {
      this.alert.isVisible = true;
      this.alert.text = 'Please specify the method.';
      this.alert.bootstrapType = 'warning';
    }
    else {
      this.isLoading = true;
      this.alert.isVisible = false;
      this.alert.text = '';
      this.alert.bootstrapType = '';
      let body: String = '';
      if (this.isXml) {
        body = (<HTMLInputElement>document.getElementById('xml-view')).value;
      }
      else {
        body = this.getXmlView();
      }
      this.productService.sendRequest(url, body, method).subscribe(
        (data) => {
          this.isLoading = false;
          var products = this.productService.castXmlToObjectsArray(data);
          this.response.setProducts(products);
          if (products.length > 0) {
            this.response.setMessage('');
          }
          else {
            if (data) {
              this.response.setMessage(data);
            }
            else {
              this.response.setMessage('OK');
            }
          }
          this.response.setStatusCode(-1);
          this.alert.isVisible = true;
          this.alert.text = 'Positive response. For more details see \'Response\' tab.';
          this.alert.bootstrapType = 'success';
        },
        (error) => {
          this.isLoading = false;
          this.response.setMessage(error.error);
          this.response.setProducts([]);
          this.response.setStatusCode(error.status);
          this.alert.isVisible = true;
          this.alert.text = 'Negative response. For more details see \'Response\' tab.';
          this.alert.bootstrapType = 'danger';
        }
      );
    }
  }

  setIsRequestShown(isRequestShown: boolean) {
    this.isRequestShown = isRequestShown;
    if (isRequestShown) {
      document.getElementById('req-btn').blur();
    }
    else {
      document.getElementById('res-btn').blur();
    }
  }
}