import { writeFile, readFile } from "fs/promises"
import { fetchTreeviewFromURL } from "./treeview-parser"
import { CUSTOM_WORLD_GEN_URL } from "./fandom"

!(async () => {
    const readme = (await readFile('../readme.md')).toString();
    const slots = readme.matchAll(/\| (.*?) \| \[(.*?)\].*?\|.*?\((.*?)\)\|(.*?)\|/g);
    for (const slot of slots) {
        await writeFile("../" + slot[2],
            JSON.stringify(
                await fetchTreeviewFromURL(
                    slot[3], slot[4]
                )
                , null, 4
            )
        );
    }
})()
