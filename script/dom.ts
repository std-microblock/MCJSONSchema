import { JSDOM } from "jsdom"

export function createDomFromHTML(html: string){
    return new JSDOM(html).window.document;
}