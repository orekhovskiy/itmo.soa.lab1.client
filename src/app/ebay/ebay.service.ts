import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient } from '@angular/common/http';
import { Product } from "src/utils/Types";

@Injectable()
export class EbayService {
    baseUrl = environment.service2BaseUrl;
    constructor(private http:HttpClient) { }

    public sendRequest(res, value): Observable<any> {
        return this.http.get(`${this.baseUrl}${res}${value}`, {responseType: 'text'});
    }

    public castXmlToObjectsArray(xml): Product[] {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml,'application/xml');
        const xmlElements = xmlDoc.getElementsByTagName('product');
        let products = [];
        for (let i = 0; i < xmlElements.length; i++) {
            const xmlElement = xmlElements[i];
            const id = this.getElementsByTagName(xmlElement, 'id')[0] ? this.getElementsByTagName(xmlElement, 'id')[0].innerHTML : null;
            const name = this.getElementsByTagName(xmlElement, 'name')[0] ? this.getElementsByTagName(xmlElement, 'name')[0].innerHTML : null;
            const coordinates = this.getElementsByTagName(xmlElement, 'coordinates')[0] ? this.getElementsByTagName(xmlElement, 'coordinates')[0] : null;
            let coordinatesX, coordinatesY;
            if (coordinates) {
                coordinatesX = this.getElementsByTagName(coordinates, 'x')[0] ? this.getElementsByTagName(coordinates, 'x')[0].innerHTML : null;
                coordinatesY = this.getElementsByTagName(coordinates, 'y')[0] ? this.getElementsByTagName(coordinates, 'y')[0].innerHTML : null;
            }
            const creationDate = this.getElementsByTagName(xmlElement, 'creationDate')[0] ? this.getElementsByTagName(xmlElement, 'creationDate')[0].innerHTML : null;
            const price = this.getElementsByTagName(xmlElement, 'price')[0] ? this.getElementsByTagName(xmlElement, 'price')[0].innerHTML : null;
            const partNumber = this.getElementsByTagName(xmlElement, 'partNumber')[0] ? this.getElementsByTagName(xmlElement, 'partNumber')[0].innerHTML : null;
            const manufactureCost = this.getElementsByTagName(xmlElement, 'manufactureCost')[0] ? this.getElementsByTagName(xmlElement, 'manufactureCost')[0].innerHTML : null;
            const uof = this.getElementsByTagName(xmlElement, 'unitOfMeasure')[0] ? this.getElementsByTagName(xmlElement, 'unitOfMeasure')[0].innerHTML : null;
            const person = this.getElementsByTagName(xmlElement, 'owner')[0] ? this.getElementsByTagName(xmlElement, 'owner')[0] : null;
            let personName, weight, nationality, location, locationX, locationY, locationZ;
            if (person) {
                personName = this.getElementsByTagName(person, 'name')[0] ? this.getElementsByTagName(person, 'name')[0].innerHTML : null;
                weight = this.getElementsByTagName(person, 'weight')[0] ? this.getElementsByTagName(person, 'weight')[0].innerHTML : null;
                nationality = this.getElementsByTagName(person, 'nationality')[0] ? this.getElementsByTagName(person, 'nationality')[0].innerHTML : null;
                location = this.getElementsByTagName(person, 'location')[0] ? this.getElementsByTagName(person, 'location')[0] : null;
                if (location) {
                    locationX = this.getElementsByTagName(location, 'x')[0] ? this.getElementsByTagName(location, 'x')[0].innerHTML : null;
                    locationY = this.getElementsByTagName(location, 'y')[0] ? this.getElementsByTagName(location, 'y')[0].innerHTML : null;
                    locationZ = this.getElementsByTagName(location, 'z')[0] ? this.getElementsByTagName(location, 'z')[0].innerHTML : null;
                }
            }
            const product: Product = {
                id: id,
                name: name,
                coordinates: coordinates 
                    ? {
                        x: coordinatesX,
                        y: coordinatesY
                    } 
                    : null,
                creationDate: creationDate,
                price: price,
                partNumber: partNumber,
                manufactureCost: manufactureCost,
                unitOfMeasure: uof,
                person: person
                    ? {
                        name: personName,
                        weight: weight,
                        country: nationality,
                        location: location
                            ? {
                                x: locationX,
                                y: locationY,
                                z: locationZ
                            }
                            : null
                    }
                    : null
            };
            products.push(product);
        }
        return products;
    }

    private getElementsByTagName(xmlElement: Element, tagName): HTMLCollectionOf<Element> {
        try {
            return xmlElement.getElementsByTagName(tagName);
        }
        catch (e) {
            return null
        }
    }
}