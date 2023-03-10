import { createDomFromHTML } from "./dom";
import { getPageAPIUrl } from "./fandom";
import { fetchJSONAndCache } from "./network";
import { flat } from "./utils";

export const parseTreeviewDOM = async (treeview, path: string[] = []) => {
    const getAllChildren = async (ul, pagename = "x") => {
        return await Promise.all([...(ul?.children ?? [])]
            .filter(v => !v.classList?.contains('mw-empty-elt'))
            .map((v, i) => parseTreeviewDOM(v, path.concat([pagename, '' + i])))
        )
    }
    const requestForPage = async (page) => {
        if (path.includes(page)) return -1 // prevent circular reference

        const json = await fetchJSONAndCache(getPageAPIUrl(page));
        const html = json.parse.text['*'];
        const c = createDomFromHTML(html).querySelector("li > ul");
        if(c?.children.length == 1) return c.querySelector("li > ul")
        return c;
    };

    if (treeview.classList?.contains('treeview-header')) {
        if (path.includes(treeview.dataset.page)) return [
            {
                tags: [],
                key: '',
                description: `Circular reference detected: ${path.join(' -> ')} -> ${treeview.dataset.page}`,
                children: []
            }
        ];
        return getAllChildren(await requestForPage(treeview.dataset.page), treeview.dataset.page)
    }


    const parseTags = (keyRoot) => {
        if (!keyRoot || !keyRoot.title?.startsWith('TAG_')) return [[], keyRoot];
        const nextTags = parseTags(keyRoot.nextSibling);
        return [
            [keyRoot.title, ...nextTags[0]], nextTags[1]
        ];
    };

    const parseKey = (keyElement) => {
        if (!keyElement || keyElement.tagName === "UL" || keyElement.style?.fontWeight !== "bold") return ['', keyElement];
        return [keyElement.textContent.trim(), keyElement.nextSibling];
    }

    const parseDesc = (descElement) => {
        if (!descElement || descElement.tagName === "UL") return ['', descElement];
        let content = descElement.textContent.trim();
        if (content.startsWith('：')) content = content.slice(1);
        const [nextContent, nextEle] = parseDesc(descElement.nextSibling);
        return [content + nextContent, nextEle];
    }

    const [tags, keyElement] = parseTags(treeview.firstElementChild);

    const [key, descriptionElement] = parseKey(keyElement);

    const [description, childEle] = parseDesc(descriptionElement);

    return {
        tags, key,
        description,
        children: flat(await getAllChildren(childEle))
    }
};

export const fetchTreeviewFromURL = async (url: string, selector: string) => {
    const dom = createDomFromHTML(await fetch(url).then(v => v.text()));
    return parseTreeviewDOM(dom.querySelector(selector));
}