import { FormControl } from "@angular/forms";

export class Template {
    private method: String;
    private url: String;
    private bootstrapType: String;

    constructor(method:String, url: String) {
      this.method = method;
      this.url = url;
      this.setBootstrapType(method);
    }
  
    public getUrl(): String {
      return this.url;
    }
    public getMethod(): String {
      return this.method;
    }
    public getBootstrapType(): String {
      return this.bootstrapType;
    }
    public setMethod(method: String): void {
      this.method = method;
      this.setBootstrapType(method);
    }
    public setUrl(url: String): void {
      this.url = url;
    }
    private setBootstrapType(method: String) {
      switch (method) {
        case 'GET':
          this.bootstrapType = 'success';
          break;
        case 'POST':
          this.bootstrapType = 'warning';
          break;
        case 'PUT':
          this.bootstrapType = 'info';
          break;
        case 'DELETE':
          this.bootstrapType = 'danger';
          break;
      }
    }
}

export interface Param {
  key: String;
  value: String;
  enabled?: boolean;
}
export class BodyElement {
  value: FormControl = new FormControl('');
  isEnabled: boolean = false;
}
export class BodyProduct {
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
export class BodyCoordinates {
  isEnabled: boolean = false;
  x: BodyElement = new BodyElement;
  y: BodyElement = new BodyElement;
}
export class BodyPerson {
  isEnabled: boolean = false;
  name: BodyElement = new BodyElement;
  weight: BodyElement = new BodyElement;
  country: BodyElement = new BodyElement;
  location: BodyLocation = new BodyLocation;
}
export class BodyLocation {
  isEnabled: boolean = false;
  x: BodyElement = new BodyElement;
  y: BodyElement = new BodyElement;
  z: BodyElement = new BodyElement;
}

export class Response {
  private statusCode: number = -1;
  private message: String = 'No request has been send yet';
  private products: Product[] = [];

  constructor() {}

  public getStatusCode() {
    return this.statusCode;
  }

  public getMessage() {
    return this.message;
  }

  public getProducts() {
    return this.products;
  }

  public setMessage(message: String) {
    this.message = message;
  }

  public setProducts(body: Product[]) {
    this.products = body;
  }

  public setStatusCode(statusCode: number) {
    this.statusCode = statusCode;
  }
}

export interface Product{
  id?: string;
  name?: string;
  coordinates?: Coordinates;
  creationDate?: string;
  price?: string;
  partNumber?: string;
  manufactureCost?: string;
  unitOfMeasure?:string;
  person?: Person;
}

export interface Coordinates {
  x?: string;
  y?: string;
}
export interface Location {
  x?: string;
  y?: string;
  z?: string;
}

export interface Person {
  name?: string;
  weight?: string;
  country?: string;
  location?:Location
}

export class Alert {
  isVisible: boolean = false;
  text: String = '';
  bootstrapType: String = '';
}