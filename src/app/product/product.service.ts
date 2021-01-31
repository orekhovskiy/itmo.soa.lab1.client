import { Injectable } from "@angular/core";
import { Template } from "src/utils/Template";
import { BodyElement, BodyProduct } from "./product.component";
import beautify from 'xml-beautifier';

@Injectable()
export class ProductService {
    public castXmlToObject(xml) {
        let parser = new DOMParser();
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
                xmlString += `<coordinates>${microElement}</coordinates`;
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

    private makeXmlElement(key: String, value: String) {
        return `<${key}>${value}</${key}>`
    }
}