import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BodyProduct, Product } from "src/utils/Types";
import beautify from 'xml-beautifier';
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class ProductService {
    baseUrl = environment.baseUrl;

    constructor(private http:HttpClient) { }

    public sendRequest(url, body, method): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'text/xml; charset=utf-8');
        body = this.compactBody(body);
        switch (method) {
            case 'GET':
                return this.http.get(this.baseUrl + url, {responseType: 'text'});
            case 'POST':
                return this.http.post(this.baseUrl + url, body, {headers, responseType: 'text'});
            case 'DELETE':
                const opts = {
                    headers: headers,
                    body: body,
                  };
                return this.http.delete(this.baseUrl + url, opts);
            case 'PUT':
                return this.http.put(this.baseUrl + url, body, {responseType: 'text'});
        }
    }

    public castObjectToXML(el: BodyProduct): String {
        var xmlString = '';
        if (el.isEnabled) {
            if (el.id.isEnabled) xmlString += this.makeXmlElement('id', el.id.value.value);
            if (el.name.isEnabled) xmlString += this.makeXmlElement('name', el.name.value.value);
            if (el.coordinates.isEnabled) {
                let microElement = '';
                if (el.coordinates.x.isEnabled) microElement += this.makeXmlElement('x', el.coordinates.x.value.value);
                if (el.coordinates.y.isEnabled) microElement += this.makeXmlElement('y', el.coordinates.x.value.value);
                xmlString += `<coordinates>${microElement}</coordinates>`;
            }
            if (el.creationDate.isEnabled) xmlString += this.makeXmlElement('creationDate', el.creationDate.value.value);
            if (el.price.isEnabled) xmlString += this.makeXmlElement('price', el.price.value.value); 
            if (el.partNumber.isEnabled) xmlString += this.makeXmlElement('partNumber', el.partNumber.value.value);
            if (el.manufactureCost.isEnabled) xmlString += this.makeXmlElement('manufactureCost', el.manufactureCost.value.value);
            if (el.unitOfMeasure.isEnabled) xmlString += this.makeXmlElement('unitOfMeasure', el.unitOfMeasure.value.value);
            if (el.person.isEnabled) {
                let microElement = '';
                if (el.person.name.isEnabled) microElement += this.makeXmlElement('name', el.person.name.value.value);
                if (el.person.weight.isEnabled) microElement += this.makeXmlElement('weight', el.person.weight.value.value);
                if (el.person.country.isEnabled) microElement += this.makeXmlElement('nationality', el.person.country.value.value);
                let nanoElement = '';
                if (el.person.location.isEnabled) {
                    nanoElement += '<location>';
                    if (el.person.location.x.isEnabled) nanoElement += this.makeXmlElement('x', el.person.location.x.value.value);
                    if (el.person.location.y.isEnabled) nanoElement += this.makeXmlElement('y', el.person.location.y.value.value);
                    if (el.person.location.z.isEnabled) nanoElement += this.makeXmlElement('z', el.person.location.z.value.value);
                    nanoElement += '</location>';
                }
                xmlString += `<owner>${microElement}${nanoElement}</owner>`;
            }
            xmlString = `<product>${xmlString}</product>`;
        }
        //var parser = new DOMParser();
        //var xmlDoc = parser.parseFromString(xmlString, "text/xml");
        
        return beautify(xmlString);
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

    private makeXmlElement(key: String, value: String) {
        return `<${key}>${value}</${key}>`
    }

    private getElementsByTagName(xmlElement: Element, tagName): HTMLCollectionOf<Element> {
        try {
            return xmlElement.getElementsByTagName(tagName);
        }
        catch (e) {
            return null
        }
    }

    private compactBody(body: String) {
        let i = 0; 
        let compactBody = '';
        while (i < body.length) {
            let j = -1;
            if (body[i] === '\n') {
                j = i;
                while (body[j + 1] === ' ') j++;
                i = j + 1;
            }
            compactBody += body[i];
            i++;
        }
        return compactBody;
    }
}