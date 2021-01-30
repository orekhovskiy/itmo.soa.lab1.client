import { Injectable } from "@angular/core";
import { Template } from "src/utils/Template";

@Injectable()
export class ProductService {
    public castXmlToObject(xml) {
        let parser = new DOMParser();
    }

    public castObjectToXML() {
        var xmlString = "<root></root>";
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xmlString, "text/xml");
        console.log(xmlDoc);
    }
}